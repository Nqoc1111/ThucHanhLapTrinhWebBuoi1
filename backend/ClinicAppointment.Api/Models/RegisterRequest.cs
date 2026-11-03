using System.ComponentModel.DataAnnotations;

namespace ClinicAppointment.Api.Models;

// DTO nhận dữ liệu đăng ký; không chấp nhận userId/passwordHash từ client.
public class RegisterRequest
{
    [Required(ErrorMessage = "Vui lòng nhập email")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    [MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
    [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;
}
