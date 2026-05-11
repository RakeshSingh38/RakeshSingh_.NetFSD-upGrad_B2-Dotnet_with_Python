using EMS.API.Data;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace EMS.Tests.Integration;

[TestFixture]
public class EmployeeIntegrationTests
{
    private static AppDbContext CreateDbContext(string databaseName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;
        return new AppDbContext(options);
    }

    [Test]
    public async Task SeedData_CanBeCreatedAndQueriedFromInMemoryDatabase()
    {
        await using var dbContext = CreateDbContext(Guid.NewGuid().ToString());
        await dbContext.Database.EnsureCreatedAsync();

        Assert.That(await dbContext.Employees.CountAsync(), Is.EqualTo(15));
        Assert.That(await dbContext.AppUsers.CountAsync(),  Is.EqualTo(2));
    }

    [Test]
    public async Task AddEmployee_PersistsAndIsRetrievable()
    {
        await using var dbContext = CreateDbContext(Guid.NewGuid().ToString());

        var employee = new Employee
        {
            FirstName = "Priya", LastName = "Prabhu", Email = "priya.prabhu@xyz.com",
            Phone = "9876543210", Department = "Engineering", Designation = "Developer",
            Salary = 500000m, JoinDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        dbContext.Employees.Add(employee);
        await dbContext.SaveChangesAsync();

        var retrieved = await dbContext.Employees
            .FirstOrDefaultAsync(e => e.Email == "priya.prabhu@xyz.com");

        Assert.That(retrieved, Is.Not.Null);
        Assert.That(retrieved!.FirstName, Is.EqualTo("Priya"));
        Assert.That(retrieved.Department, Is.EqualTo("Engineering"));
    }

    [Test]
    public async Task DeleteEmployee_RemovesRecord()
    {
        await using var dbContext = CreateDbContext(Guid.NewGuid().ToString());

        var employee = new Employee
        {
            FirstName = "Arun", LastName = "Kumar", Email = "arun.kumar@xyz.com",
            Phone = "9876543211", Department = "Finance", Designation = "Analyst",
            Salary = 650000m, JoinDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc),
            Status = "Inactive", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        dbContext.Employees.Add(employee);
        await dbContext.SaveChangesAsync();

        var countBefore = await dbContext.Employees.CountAsync();

        dbContext.Employees.Remove(employee);
        await dbContext.SaveChangesAsync();

        var countAfter = await dbContext.Employees.CountAsync();

        Assert.That(countAfter, Is.EqualTo(countBefore - 1));
        Assert.That(
            await dbContext.Employees.AnyAsync(e => e.Email == "arun.kumar@xyz.com"),
            Is.False);
    }

    [Test]
    public async Task EmailExistsCheck_ReturnsTrueForDuplicateEmail()
    {
        await using var dbContext = CreateDbContext(Guid.NewGuid().ToString());

        dbContext.Employees.Add(new Employee
        {
            FirstName = "Meera", LastName = "Seth", Email = "meera.seth@xyz.com",
            Phone = "9876543212", Department = "Marketing", Designation = "Manager",
            Salary = 700000m, JoinDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc),
            Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        });
        await dbContext.SaveChangesAsync();

        var emailAlreadyExists = await dbContext.Employees
            .AnyAsync(e => e.Email.ToLower() == "meera.seth@xyz.com");

        Assert.That(emailAlreadyExists, Is.True);
    }

    [Test]
    public async Task DashboardCounts_CorrectAfterSeeding()
    {
        await using var dbContext = CreateDbContext(Guid.NewGuid().ToString());

        dbContext.Employees.AddRange(
            new Employee
            {
                FirstName = "E1", LastName = "L1", Email = "e1@xyz.com", Phone = "1111111111",
                Department = "Engineering", Designation = "Dev", Salary = 500000, Status = "Active",
                JoinDate = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FirstName = "E2", LastName = "L2", Email = "e2@xyz.com", Phone = "2222222222",
                Department = "Finance", Designation = "Ana", Salary = 600000, Status = "Inactive",
                JoinDate = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FirstName = "E3", LastName = "L3", Email = "e3@xyz.com", Phone = "3333333333",
                Department = "Engineering", Designation = "Lead", Salary = 800000, Status = "Active",
                JoinDate = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            }
        );
        await dbContext.SaveChangesAsync();

        Assert.That(await dbContext.Employees.CountAsync(),                                         Is.EqualTo(3));
        Assert.That(await dbContext.Employees.CountAsync(e => e.Status == "Active"),                Is.EqualTo(2));
        Assert.That(await dbContext.Employees.CountAsync(e => e.Status == "Inactive"),              Is.EqualTo(1));
        Assert.That(await dbContext.Employees.Select(e => e.Department).Distinct().CountAsync(),    Is.EqualTo(2));
    }
}
