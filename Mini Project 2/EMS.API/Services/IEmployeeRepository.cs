using EMS.API.DTOs;
using EMS.API.Models;

namespace EMS.API.Services;

/// <summary>
/// data access contract for Employee entities -
/// decouples EmployeeService from EF Core to enable pure unit testing with Moq
/// </summary>
public interface IEmployeeRepository
{
    /// <summary>returns a no-tracking IQueryable over all employees - used to compose server-side filter, sort, and paginate queries</summary>
    IQueryable<Employee> Query();

    /// <summary>finds an employee by primary key - returns null if not found</summary>
    Task<Employee?> GetByIdAsync(int id);

    /// <summary>stages a new employee entity for insertion (call <see cref="SaveChangesAsync"/> to persist)</summary>
    Task AddAsync(Employee employee);

    /// <summary>persists all pending change-tracker operations to the database</summary>
    Task SaveChangesAsync();

    /// <summary>marks an employee entity for deletion (call <see cref="SaveChangesAsync"/> to persist)</summary>
    void Remove(Employee employee);

    /// <summary>checks whether an email is already in use - excludeId allows the same email on an update request</summary>
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
}
