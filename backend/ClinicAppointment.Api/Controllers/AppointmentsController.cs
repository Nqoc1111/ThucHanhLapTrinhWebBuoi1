using ClinicAppointment.Api.Data;
using ClinicAppointment.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointment.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController(AppDbContext db) : ControllerBase
{
    // GET /api/appointments
    [HttpGet]
    public async Task<ActionResult<List<Appointment>>> GetAll()
    {
        var appointments = await db.Appointments.AsNoTracking()
            .OrderByDescending(a => a.Id).ToListAsync();
        return Ok(appointments);
    }

    // GET /api/appointments/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Appointment>> GetById(int id)
    {
        var appointment = await db.Appointments.AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);
        return appointment is null ? NotFound() : Ok(appointment);
    }

    // POST /api/appointments
    [HttpPost]
    public async Task<ActionResult<Appointment>> Create([FromBody] AppointmentRequest request)
    {
        var dateError = ValidateRequest(request);
        if (dateError is not null) return BadRequest(new { message = dateError });

        var appointment = new Appointment();
        CopyInput(request, appointment);
        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
    }

    // PUT /api/appointments/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] AppointmentRequest request)
    {
        var appointment = await db.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        var dateError = ValidateRequest(request);
        if (dateError is not null) return BadRequest(new { message = dateError });

        CopyInput(request, appointment);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/appointments/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var appointment = await db.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        db.Appointments.Remove(appointment);
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
}
