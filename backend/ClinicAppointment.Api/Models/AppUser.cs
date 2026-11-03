namespace ClinicAppointment.Api.Models;

// User là entity được EF Core ánh xạ thành bảng Users.
// Chỉ lưu password đã băm, tuyệt đối không lưu password dạng rõ.
public class AppUser
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string NormalizedEmail { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<Appointment> Appointments { get; set; } = new();
}
