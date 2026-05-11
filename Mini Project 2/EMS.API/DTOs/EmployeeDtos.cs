using System.ComponentModel.DataAnnotations;

namespace EMS.API.DTOs;

public class EmployeeRequestDto
{
    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required, MaxLength(200), EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{10}$", ErrorMessage = "Phone must be 10 digits.")]
    public string Phone { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    [RegularExpression(@"^(Engineering|Marketing|HR|Finance|Operations)$",
        ErrorMessage = "Department must be Engineering, Marketing, HR, Finance, or Operations.")]
    public string Department { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Designation { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
    public decimal Salary { get; set; }

    public DateTime JoinDate { get; set; }

    [Required, RegularExpression(@"^(Active|Inactive)$", ErrorMessage = "Status must be Active or Inactive.")]
    public string Status { get; set; } = string.Empty;
}

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public DateTime JoinDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class EmployeeQueryParamsDto
{
    public string? Search { get; set; }
    public string? Department { get; set; }
    public string? Status { get; set; }
    public string? SortBy { get; set; } = "name";
    public string? SortDir { get; set; } = "asc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class PagedResultDto<T>
{
    public List<T> Data { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPrevPage { get; set; }
}

public class DepartmentBreakdownDto
{
    public string Department { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Percentage { get; set; }
}

public class DashboardSummaryDto
{
    public int TotalEmployees { get; set; }
    public int ActiveEmployees { get; set; }
    public int InactiveEmployees { get; set; }
    public int TotalDepartments { get; set; }
    public List<DepartmentBreakdownDto> DepartmentBreakdown { get; set; } = [];
    public List<EmployeeResponseDto> RecentEmployees { get; set; } = [];
}

public class EmployeeResult
{
    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public EmployeeResponseDto? Data { get; set; }
}
