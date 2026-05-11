using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services;

public class EmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    /// <summary>returns a filtered, sorted, and paginated list of employees - all filtering runs in SQL Server</summary>
    public async Task<PagedResultDto<EmployeeResponseDto>> GetEmployeesAsync(EmployeeQueryParamsDto query)
    {
        var pageSize = query.PageSize <= 0 ? 10 : Math.Min(query.PageSize, 100);
        var page     = query.Page     <= 0 ? 1  : query.Page;

        IQueryable<Employee> employees = _repository.Query();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            employees = employees.Where(e =>
                (e.FirstName + " " + e.LastName).ToLower().Contains(search) ||
                e.Email.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Department))
            employees = employees.Where(e => e.Department == query.Department.Trim());

        if (!string.IsNullOrWhiteSpace(query.Status))
            employees = employees.Where(e => e.Status == query.Status.Trim());

        employees = ApplySorting(employees, query.SortBy, query.SortDir);

        var totalCount = await employees.CountAsync();
        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        if (totalPages > 0 && page > totalPages)
            page = totalPages;

        var data = await employees
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(MapToDto())
            .ToListAsync();

        return new PagedResultDto<EmployeeResponseDto>
        {
            Data        = data,
            TotalCount  = totalCount,
            Page        = page,
            PageSize    = pageSize,
            TotalPages  = totalPages,
            HasNextPage = page < totalPages,
            HasPrevPage = page > 1
        };
    }

    /// <summary>returns a single employee by ID, or null if not found</summary>
    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
        => await _repository.Query()
            .Where(e => e.Id == id)
            .Select(MapToDto())
            .FirstOrDefaultAsync();

    /// <summary>returns dashboard KPI counts, department breakdown, and the 5 most recent employees</summary>
    public async Task<DashboardSummaryDto> GetDashboardAsync()
    {
        var q = _repository.Query();

        var totalEmployees    = await q.CountAsync();
        var activeEmployees   = await q.CountAsync(e => e.Status == "Active");
        var inactiveEmployees = await q.CountAsync(e => e.Status == "Inactive");
        var totalDepartments  = await q.Select(e => e.Department).Distinct().CountAsync();

        var breakdown = await q
            .GroupBy(e => e.Department)
            .Select(g => new { Department = g.Key, Count = g.Count() })
            .OrderBy(x => x.Department)
            .ToListAsync();

        var recent = await q
            .OrderByDescending(e => e.CreatedAt)
            .ThenByDescending(e => e.Id)
            .Take(5)
            .Select(MapToDto())
            .ToListAsync();

        return new DashboardSummaryDto
        {
            TotalEmployees      = totalEmployees,
            ActiveEmployees     = activeEmployees,
            InactiveEmployees   = inactiveEmployees,
            TotalDepartments    = totalDepartments,
            DepartmentBreakdown = breakdown
                .Select(x => new DepartmentBreakdownDto
                {
                    Department = x.Department,
                    Count      = x.Count,
                    Percentage = totalEmployees == 0
                        ? 0
                        : (int)Math.Round(x.Count * 100.0 / totalEmployees)
                }).ToList(),
            RecentEmployees = recent
        };
    }

    /// <summary>creates a new employee - returns 409 Conflict if the email is already in use</summary>
    public async Task<EmployeeResult> CreateAsync(EmployeeRequestDto request)
    {
        var email = NormalizeEmail(request.Email);
        if (await _repository.EmailExistsAsync(email))
            return Fail(409, "Email already exists.");

        var employee = new Employee
        {
            FirstName   = request.FirstName.Trim(),
            LastName    = request.LastName.Trim(),
            Email       = email,
            Phone       = request.Phone.Trim(),
            Department  = request.Department.Trim(),
            Designation = request.Designation.Trim(),
            Salary      = request.Salary,
            JoinDate    = EnsureUtc(request.JoinDate),
            Status      = request.Status.Trim()
        };

        await _repository.AddAsync(employee);
        await _repository.SaveChangesAsync();

        return new EmployeeResult
        {
            Success    = true,
            StatusCode = 201,
            Message    = "Employee created successfully.",
            Data       = await GetByIdAsync(employee.Id)
        };
    }

    /// <summary>updates an employee record - returns 404 if not found, 409 if email conflicts</summary>
    public async Task<EmployeeResult> UpdateAsync(int id, EmployeeRequestDto request)
    {
        var employee = await _repository.GetByIdAsync(id);
        if (employee is null)
            return Fail(404, "Employee not found.");

        var email = NormalizeEmail(request.Email);
        if (await _repository.EmailExistsAsync(email, id))
            return Fail(409, "Email already exists.");

        employee.FirstName   = request.FirstName.Trim();
        employee.LastName    = request.LastName.Trim();
        employee.Email       = email;
        employee.Phone       = request.Phone.Trim();
        employee.Department  = request.Department.Trim();
        employee.Designation = request.Designation.Trim();
        employee.Salary      = request.Salary;
        employee.JoinDate    = EnsureUtc(request.JoinDate);
        employee.Status      = request.Status.Trim();

        await _repository.SaveChangesAsync();

        return new EmployeeResult
        {
            Success    = true,
            StatusCode = 200,
            Message    = "Employee updated successfully.",
            Data       = await GetByIdAsync(employee.Id)
        };
    }

    /// <summary>deletes an employee by ID - returns 404 if not found</summary>
    public async Task<EmployeeResult> DeleteAsync(int id)
    {
        var employee = await _repository.GetByIdAsync(id);
        if (employee is null)
            return Fail(404, "Employee not found.");

        _repository.Remove(employee);
        await _repository.SaveChangesAsync();

        return new EmployeeResult
        {
            Success    = true,
            StatusCode = 200,
            Message    = "Employee deleted successfully."
        };
    }

    private static IQueryable<Employee> ApplySorting(
        IQueryable<Employee> query, string? sortBy, string? sortDir)
    {
        var field      = string.IsNullOrWhiteSpace(sortBy) ? "name" : sortBy.Trim().ToLowerInvariant();
        var descending = string.Equals(sortDir?.Trim(), "desc", StringComparison.OrdinalIgnoreCase);

        return field switch
        {
            "salary"   => descending ? query.OrderByDescending(e => e.Salary)   : query.OrderBy(e => e.Salary),
            "joindate" => descending ? query.OrderByDescending(e => e.JoinDate) : query.OrderBy(e => e.JoinDate),
            _          => descending
                ? query.OrderByDescending(e => e.LastName).ThenByDescending(e => e.FirstName)
                : query.OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
        };
    }

    private static EmployeeResult Fail(int statusCode, string message) => new()
        { Success = false, StatusCode = statusCode, Message = message };

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static DateTime EnsureUtc(DateTime dt) =>
        dt.Kind == DateTimeKind.Utc ? dt : DateTime.SpecifyKind(dt, DateTimeKind.Utc);

    private static System.Linq.Expressions.Expression<Func<Employee, EmployeeResponseDto>> MapToDto()
        => e => new EmployeeResponseDto
        {
            Id          = e.Id,
            FirstName   = e.FirstName,
            LastName    = e.LastName,
            Email       = e.Email,
            Phone       = e.Phone,
            Department  = e.Department,
            Designation = e.Designation,
            Salary      = e.Salary,
            JoinDate    = e.JoinDate,
            Status      = e.Status,
            CreatedAt   = e.CreatedAt,
            UpdatedAt   = e.UpdatedAt
        };
}