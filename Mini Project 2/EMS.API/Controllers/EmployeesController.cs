using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers;

[ApiController]
[Route("api/employees")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly EmployeeService _employeeService;

    public EmployeesController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    /// <summary>GET /api/employees - returns a filtered, sorted, paginated list of employees</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<EmployeeResponseDto>>> GetEmployees([FromQuery] EmployeeQueryParamsDto query)
    {
        return Ok(await _employeeService.GetEmployeesAsync(query));
    }

    /// <summary>GET /api/employees/{id} - returns a single employee by ID, or 404 if not found</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeResponseDto>> GetEmployeeById(int id)
    {
        var employee = await _employeeService.GetByIdAsync(id);
        return employee is null ? NotFound(new { message = "Employee not found." }) : Ok(employee);
    }

    /// <summary>GET /api/employees/dashboard - returns KPI counts, department breakdown, and recent employees</summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboard()
    {
        return Ok(await _employeeService.GetDashboardAsync());
    }

    /// <summary>POST /api/employees - creates a new employee (Admin only) - returns 409 if email exists</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateEmployee([FromBody] EmployeeRequestDto request)
    {
        var result = await _employeeService.CreateAsync(request);
        return result.Success
            ? CreatedAtAction(nameof(GetEmployeeById), new { id = result.Data!.Id }, result.Data)
            : StatusCode(result.StatusCode, new { message = result.Message });
    }

    /// <summary>PUT /api/employees/{id} - updates an employee (Admin only) - returns 404 or 409 on conflict</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeRequestDto request)
    {
        var result = await _employeeService.UpdateAsync(id, request);
        return result.Success
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { message = result.Message });
    }

    /// <summary>DELETE /api/employees/{id} - deletes an employee (Admin only) - returns 404 if not found</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var result = await _employeeService.DeleteAsync(id);
        return result.Success
            ? Ok(new { message = result.Message })
            : StatusCode(result.StatusCode, new { message = result.Message });
    }
}
