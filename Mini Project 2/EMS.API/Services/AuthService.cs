using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EMS.API.Services;

public class AuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    /// <summary>registers a new user - hashes the password with BCrypt and returns a JWT on success</summary>
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var username = request.Username.Trim();
        if (string.IsNullOrWhiteSpace(username)) return Fail(400, "Username is required.");
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6) return Fail(400, "Password must be at least 6 characters.");

        var role = NormalizeRole(request.Role);
        if (role is null) return Fail(400, "Role must be Admin or Viewer.");
        if (await _dbContext.AppUsers.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
            return Fail(409, "Username already exists.");

        var user = new AppUser
        {
            Username = username, Role = role, CreatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12)
        };

        _dbContext.AppUsers.Add(user);
        await _dbContext.SaveChangesAsync();

        var token = GenerateToken(user);
        return Success(201, "Registration successful.", user.Username, user.Role, token);
    }

    /// <summary>verifies credentials using BCrypt and returns a signed JWT on success</summary>
    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var username = request.Username.Trim();
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(request.Password))
            return Fail(401, "Invalid credentials.");

        var user = await _dbContext.AppUsers
            .FirstOrDefaultAsync(item => item.Username.ToLower() == username.ToLower());

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Fail(401, "Invalid credentials.");

        var token = GenerateToken(user);
        return Success(200, "Login successful.", user.Username, user.Role, token);
    }

    private string GenerateToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryHours = double.Parse(_configuration["Jwt:ExpiryHours"] ?? "8");

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string? NormalizeRole(string? role)
    {
        var r = string.IsNullOrWhiteSpace(role) ? "viewer" : role.Trim().ToLower();
        return r == "admin" ? "Admin" : r == "viewer" ? "Viewer" : null;
    }

    private static AuthResponseDto Fail(int statusCode, string message) => new()
        { Success = false, StatusCode = statusCode, Message = message };

    private static AuthResponseDto Success(int statusCode, string message, string username, string role, string token) => new()
        { Success = true, StatusCode = statusCode, Message = message, Username = username, Role = role, Token = token };
}