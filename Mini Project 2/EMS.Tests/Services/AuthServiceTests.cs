using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using EMS.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Services;

[TestFixture]
public class AuthServiceTests
{
    private static AppDbContext CreateDbContext(string name)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(name)
            .Options;
        return new AppDbContext(options);
    }

    private static IConfiguration CreateConfig()
    {
        var config = new Mock<IConfiguration>();
        config.Setup(c => c["Jwt:Key"]).Returns("TestSecretKey_32Chars_ForNUnit!!");
        config.Setup(c => c["Jwt:Issuer"]).Returns("EMS.API");
        config.Setup(c => c["Jwt:Audience"]).Returns("EMS.Client");
        config.Setup(c => c["Jwt:ExpiryHours"]).Returns("8");
        return config.Object;
    }

    private static async Task<AppDbContext> CreateDbContextWithUser(
        string name, string username, string password, string role)
    {
        var db = CreateDbContext(name);
        db.AppUsers.Add(new AppUser
        {
            Username = username, Role = role, CreatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)
        });
        await db.SaveChangesAsync();
        return db;
    }

    [Test]
    public async Task LoginAsync_ValidCredentials_ReturnsToken()
    {
        await using var db = await CreateDbContextWithUser(
            Guid.NewGuid().ToString(), "admin", "admin123", "Admin");

        var result = await new AuthService(db, CreateConfig())
            .LoginAsync(new LoginRequestDto { Username = "admin", Password = "admin123" });

        Assert.That(result.Success, Is.True);
        Assert.That(result.Token, Is.Not.Null.And.Not.Empty);
        Assert.That(result.Role, Is.EqualTo("Admin"));
    }

    [Test]
    public async Task LoginAsync_WrongPassword_ReturnsFailure()
    {
        await using var db = await CreateDbContextWithUser(
            Guid.NewGuid().ToString(), "admin", "admin123", "Admin");

        var result = await new AuthService(db, CreateConfig())
            .LoginAsync(new LoginRequestDto { Username = "admin", Password = "wrong-password" });

        Assert.That(result.Success, Is.False);
        Assert.That(result.StatusCode, Is.EqualTo(401));
    }

    [Test]
    public async Task RegisterAsync_DuplicateUsername_ReturnsConflict()
    {
        await using var db = await CreateDbContextWithUser(
            Guid.NewGuid().ToString(), "viewer", "viewer123", "Viewer");

        var result = await new AuthService(db, CreateConfig())
            .RegisterAsync(new RegisterRequestDto { Username = "viewer", Password = "newpass123", Role = "Admin" });

        Assert.That(result.Success, Is.False);
        Assert.That(result.StatusCode, Is.EqualTo(409));
    }

    [Test]
    public async Task RegisterAsync_ValidRequest_ReturnsToken()
    {
        await using var db = CreateDbContext(Guid.NewGuid().ToString());

        var result = await new AuthService(db, CreateConfig())
            .RegisterAsync(new RegisterRequestDto { Username = "newadmin", Password = "newpass123", Role = "Admin" });

        Assert.That(result.Success, Is.True);
        Assert.That(result.Token, Is.Not.Null.And.Not.Empty);
        Assert.That(result.Username, Is.EqualTo("newadmin"));
        Assert.That(result.Role, Is.EqualTo("Admin"));
    }
}
