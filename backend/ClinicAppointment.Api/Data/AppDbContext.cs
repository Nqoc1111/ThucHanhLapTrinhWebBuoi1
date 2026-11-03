using ClinicAppointment.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointment.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // DB đảm bảo không có hai tài khoản trùng email (không phân biệt hoa/thường).
        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.NormalizedEmail)
            .IsUnique();

        // Lịch mới có chủ sở hữu. Lịch cũ từ tuần 2 chưa có owner nên giữ NULL;
        // điều này tránh làm hỏng dữ liệu khi thêm cột vào database hiện tại.
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.OwnerUser)
            .WithMany(u => u.Appointments)
            .HasForeignKey(a => a.OwnerUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
