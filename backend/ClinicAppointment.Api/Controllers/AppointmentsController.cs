using System.Security.Claims;
using ClinicAppointment.Api.Data;
using ClinicAppointment.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointment.Api.Controllers;

// Chỉ user đã đăng nhập mới truy cập CRUD lịch khám.
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserId => int.TryParse(
        User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<Appointment>>> GetAll()
    {
        if (CurrentUserId is not int userId) return Unauthorized();
        var items = await db.Appointments.AsNoTracking()
            .Where(a => a.OwnerUserId == userId) // Không lộ lịch của người khác.
            .OrderByDescending(a => a.Id)
            .ToListAsync();
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (CurrentUserId is not int userId) return Unauthorized();
        var item = await db.Appointments.AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id && a.OwnerUserId == userId);
        return item is null ? NotFound() : Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AppointmentRequest request)
    {
        if (CurrentUserId is not int userId) return Unauthorized();
        var error = ValidateRequest(request);
        if (error is not null) return BadRequest(new { message = error });

        var appointment = new Appointment { OwnerUserId = userId };
        CopyInput(request, appointment);
        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, ToResponse(appointment));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] AppointmentRequest request)
    {
        if (CurrentUserId is not int userId) return Unauthorized();
        var item = await db.Appointments
            .FirstOrDefaultAsync(a => a.Id == id && a.OwnerUserId == userId);
        if (item is null) return NotFound();

        var error = ValidateRequest(request);
        if (error is not null) return BadRequest(new { message = error });

        CopyInput(request, item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (CurrentUserId is not int userId) return Unauthorized();
        var item = await db.Appointments
            .FirstOrDefaultAsync(a => a.Id == id && a.OwnerUserId == userId);
        if (item is null) return NotFound();

        db.Appointments.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static string? ValidateRequest(AppointmentRequest request)
    {
        if (request.Date < DateOnly.FromDateTime(DateTime.Now))
            return "Ngày khám không được ở trong quá khứ";

        string[] allowedDepartments = ["Nội tổng quát", "Nhi khoa", "Da liễu", "Tai Mũi Họng"];
        if (!allowedDepartments.Contains(request.Department))
            return "Chuyên khoa không hợp lệ";
        return null;
    }

    private static void CopyInput(AppointmentRequest source, Appointment target)
    {
        target.PatientName = source.PatientName.Trim();
        target.Phone = source.Phone.Trim();
        target.Department = source.Department;
        target.Date = source.Date;
        target.Time = source.Time;
        target.Note = source.Note?.Trim();
    }

    // Trả DTO đơn giản, không serialize OwnerUser.PasswordHash.
    private static object ToResponse(Appointment a) => new
    {
        a.Id, a.PatientName, a.Phone, a.Department, a.Date, a.Time,
        a.Note, a.Status, a.CreatedAtUtc
    };
}
