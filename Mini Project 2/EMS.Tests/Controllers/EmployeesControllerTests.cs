using EMS.API.Controllers;
using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using EMS.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace EMS.Tests.Controllers;

[TestFixture]
public class EmployeesControllerTests
{
    private static AppDbContext CreateDbContext(string name)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(name)
            .Options;
        return new AppDbContext(options);
    }

    private static EmployeesController BuildController(AppDbContext db) =>
        new(new EmployeeService(new EmployeeRepository(db)));

    private static async Task SeedAsync(AppDbContext db)
    {
        db.Employees.AddRange(
            new Employee
            {
                FirstName = "Priya", LastName = "Prabhu", Email = "priya.prabhu@xyz.com",
                Phone = "9876543210", Department = "Engineering", Designation = "Developer",
                Salary = 500000, Status = "Active",
                JoinDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FirstName = "Arun", LastName = "Kumar", Email = "arun.kumar@xyz.com",
                Phone = "9876543211", Department = "Finance", Designation = "Analyst",
                Salary = 650000, Status = "Inactive",
                JoinDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            }
        );
        await db.SaveChangesAsync();
    }

    [Test]
    public async Task GetEmployees_ReturnsOkWithPagedResult()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        await SeedAsync(db);
        var controller = BuildController(db);

        var okResult = (await controller.GetEmployees(new EmployeeQueryParamsDto())).Result as OkObjectResult;

        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult!.StatusCode, Is.EqualTo(200));

        var returned = okResult.Value as PagedResultDto<EmployeeResponseDto>;
        Assert.That(returned, Is.Not.Null);
        Assert.That(returned!.TotalCount, Is.EqualTo(2));
    }

    [Test]
    public async Task GetEmployeeById_ExistingId_ReturnsOk()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        await SeedAsync(db);
        var controller = BuildController(db);

        var id = db.Employees.First().Id;
        var okResult = (await controller.GetEmployeeById(id)).Result as OkObjectResult;

        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult!.StatusCode, Is.EqualTo(200));
    }

    [Test]
    public async Task GetEmployeeById_NonExistingId_ReturnsNotFound()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        var controller = BuildController(db);

        var notFound = (await controller.GetEmployeeById(9999)).Result as NotFoundObjectResult;

        Assert.That(notFound, Is.Not.Null);
        Assert.That(notFound!.StatusCode, Is.EqualTo(404));
    }

    [Test]
    public async Task CreateEmployee_ValidRequest_Returns201Created()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        var controller = BuildController(db);

        var request = new EmployeeRequestDto
        {
            FirstName = "Nikhil", LastName = "Rao", Email = "nikhil.rao@xyz.com",
            Phone = "9998887776", Department = "HR", Designation = "Executive",
            Salary = 450000, Status = "Active",
            JoinDate = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc)
        };

        var createdAtResult = (await controller.CreateEmployee(request)) as CreatedAtActionResult;

        Assert.That(createdAtResult, Is.Not.Null);
        Assert.That(createdAtResult!.StatusCode, Is.EqualTo(201));
    }

    [Test]
    public async Task CreateEmployee_DuplicateEmail_Returns409Conflict()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        await SeedAsync(db);
        var controller = BuildController(db);

        var request = new EmployeeRequestDto
        {
            FirstName = "Test", LastName = "User", Email = "priya.prabhu@xyz.com",
            Phone = "1234567890", Department = "HR", Designation = "Executive",
            Salary = 300000, Status = "Active", JoinDate = DateTime.UtcNow
        };

        var statusResult = (await controller.CreateEmployee(request)) as ObjectResult;

        Assert.That(statusResult, Is.Not.Null);
        Assert.That(statusResult!.StatusCode, Is.EqualTo(409));
    }

    [Test]
    public async Task DeleteEmployee_ExistingId_ReturnsOk()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        await SeedAsync(db);
        var controller = BuildController(db);

        var id = db.Employees.First().Id;
        var okResult = (await controller.DeleteEmployee(id)) as OkObjectResult;

        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult!.StatusCode, Is.EqualTo(200));
    }

    [Test]
    public async Task DeleteEmployee_NonExistingId_ReturnsNotFound()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        var controller = BuildController(db);

        var statusResult = (await controller.DeleteEmployee(9999)) as ObjectResult;

        Assert.That(statusResult, Is.Not.Null);
        Assert.That(statusResult!.StatusCode, Is.EqualTo(404));
    }
}
