namespace ClinicAppointment.Api.Models;

public class Appointment
{
    public int Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public string Time { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    // Nullable để giữ nguyên các bản ghi tuần 2; bản ghi mới luôn gắn user đăng nhập.
    public int? OwnerUserId { get; set; }
    public AppUser? OwnerUser { get; set; }
}
