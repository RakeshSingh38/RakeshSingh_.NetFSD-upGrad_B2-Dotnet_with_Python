using EMS.API.Data;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _dbContext;

    public EmployeeRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc/>
    public IQueryable<Employee> Query()
        => _dbContext.Employees.AsNoTracking();

    /// <inheritdoc/>
    public async Task<Employee?> GetByIdAsync(int id)
        => await _dbContext.Employees.FirstOrDefaultAsync(e => e.Id == id);

    /// <inheritdoc/>
    public async Task AddAsync(Employee employee)
        => await _dbContext.Employees.AddAsync(employee);

    /// <inheritdoc/>
    public void Remove(Employee employee)
        => _dbContext.Employees.Remove(employee);

    /// <inheritdoc/>
    public async Task SaveChangesAsync()
        => await _dbContext.SaveChangesAsync();

    /// <inheritdoc/>
    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        => await _dbContext.Employees.AnyAsync(e =>
            e.Email.ToLower() == email.ToLower() &&
            (!excludeId.HasValue || e.Id != excludeId.Value));
}
