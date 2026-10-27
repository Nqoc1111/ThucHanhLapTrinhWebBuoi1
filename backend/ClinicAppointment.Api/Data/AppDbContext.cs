using ClinicAppointment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointment.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Appointment> Appointments => Set<Appointment>();
}
