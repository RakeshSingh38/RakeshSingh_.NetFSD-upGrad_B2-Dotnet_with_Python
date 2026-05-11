using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using EMS.API.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Services;

[TestFixture]
public class EmployeeServiceTests
{
    private static AppDbContext CreateDbContext(string name)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(name)
            .Options;
        return new AppDbContext(options);
    }

    private static EmployeeService BuildService(AppDbContext db) => new(new EmployeeRepository(db));

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
    public async Task GetByIdAsync_ValidId_ReturnsMappedDto()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        await SeedAsync(db);
        var service = BuildService(db);

        var id     = db.Employees.First().Id;
        var result = await service.GetByIdAsync(id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.FirstName, Is.EqualTo("Priya"));
        Assert.That(result.Email, Is.EqualTo("priya.prabhu@xyz.com"));
        Assert.That(result.Status, Is.EqualTo("Active"));
    }

    [Test]
    public async Task GetByIdAsync_NonExistentId_ReturnsNull()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        var service = BuildService(db);

        var result = await service.GetByIdAsync(9999);

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task CreateAsync_ValidRequest_AddsEmployeeToDatabase()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());
        var service = BuildService(db);

        var result = await service.CreateAsync(new EmployeeRequestDto
        {
            FirstName = "Nikhil", LastName = "Rao", Email = "nikhil.rao@xyz.com",
            Phone = "9998887776", Department = "HR", Designation = "Executive",
            Salary = 450000, Status = "Active",
            JoinDate = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc)
        });

        Assert.That(result.Success, Is.True);
        Assert.That(result.StatusCode, Is.EqualTo(201));
        Assert.That(result.Data, Is.Not.Null);
        Assert.That(result.Data!.FirstName, Is.EqualTo("Nikhil"));
        Assert.That(await db.Employees.CountAsync(), Is.EqualTo(1));
    }

    [Test]
    public async Task CreateAsync_DuplicateEmail_Returns409WithoutCallingAdd()
    {
        var repoMock = new Mock<IEmployeeRepository>();
        repoMock.Setup(r => r.EmailExistsAsync("dup@xyz.com", null)).ReturnsAsync(true);

        var service = new EmployeeService(repoMock.Object);
        var result  = await service.CreateAsync(new EmployeeRequestDto
        {
            FirstName = "Test", LastName = "User", Email = "dup@xyz.com",
            Phone = "1234567890", Department = "HR", Designation = "Executive",
            Salary = 300000, Status = "Active", JoinDate = DateTime.UtcNow
        });

        Assert.That(result.Success, Is.False);
        Assert.That(result.StatusCode, Is.EqualTo(409));
        repoMock.Verify(r => r.AddAsync(It.IsAny<Employee>()), Times.Never);
    }

    [Test]
    public async Task DeleteAsync_ValidId_CallsRemoveAndSaveChanges()
    {
        var fakeEmployee = new Employee
        {
            Id = 5, FirstName = "Arun", LastName = "Kumar", Email = "arun.kumar@xyz.com",
            Phone = "9876543211", Department = "Finance", Designation = "Analyst",
            Salary = 650000, Status = "Inactive",
            JoinDate = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        var repoMock = new Mock<IEmployeeRepository>();
        repoMock.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(fakeEmployee);
        repoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var service = new EmployeeService(repoMock.Object);
        var result  = await service.DeleteAsync(5);

        Assert.That(result.Success, Is.True);
        Assert.That(result.StatusCode, Is.EqualTo(200));
        repoMock.Verify(r => r.Remove(fakeEmployee), Times.Once);
        repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_InvalidId_Returns404WithoutCallingRemove()
    {
        var repoMock = new Mock<IEmployeeRepository>();
        repoMock.Setup(r => r.GetByIdAsync(9999)).ReturnsAsync((Employee?)null);

        var service = new EmployeeService(repoMock.Object);
        var result  = await service.DeleteAsync(9999);

        Assert.That(result.Success, Is.False);
        Assert.That(result.StatusCode, Is.EqualTo(404));
        repoMock.Verify(r => r.Remove(It.IsAny<Employee>()), Times.Never);
    }
}
