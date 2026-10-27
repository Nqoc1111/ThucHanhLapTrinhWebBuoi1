using System.ComponentModel.DataAnnotations;

namespace ClinicAppointment.Api.Models;

// DTO: Không nhận Id, Status hoặc CreatedAtUtc từ phía người dùng.
public class AppointmentRequest
{
    [Required(ErrorMessage = "Vui lòng nhập tên bệnh nhân")]
    [StringLength(100, MinimumLength = 2)]
    public string PatientName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^0[0-9]{9}$", ErrorMessage = "Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [StringLength(80)]
    public string Department { get; set; } = string.Empty;

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    [RegularExpression(@"^(08:00|09:30|13:30|15:00)$", ErrorMessage = "Khung giờ không hợp lệ")]
    public string Time { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Note { get; set; }
}
