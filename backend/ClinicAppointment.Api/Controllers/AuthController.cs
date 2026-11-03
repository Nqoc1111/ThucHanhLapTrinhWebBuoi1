using System.Security.Claims;
using Microsoft.Data.Sqlite;
using ClinicAppointment.Api.Data;
using ClinicAppointment.Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointment.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, IPasswordHasher<AppUser> passwordHasher) : ControllerBase
{
    // POST /api/auth/register - kiểm tra và lưu email + password đã băm.
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var normalizedEmail = email.ToUpperInvariant();

        if (await db.Users.AnyAsync(u => u.NormalizedEmail == normalizedEmail))
            return Conflict(new { message = "Email đã được đăng ký." });

        var user = new AppUser { Email = email, NormalizedEmail = normalizedEmail };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        db.Users.Add(user);

        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqliteException sqlite
            && sqlite.SqliteErrorCode == 19)
        {
            // SQLite error 19: unique constraint, xảy ra nếu đăng ký trùng đồng thời.
            return Conflict(new { message = "Email đã được đăng ký." });
        }

        return StatusCode(StatusCodes.Status201Created, new { user.Id, user.Email });
    }

    // POST /api/auth/login - query DB và VerifyHashedPassword.
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);
        if (user is null)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
            await db.SaveChangesAsync();
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties { IsPersistent = false });

        return Ok(new { user.Id, user.Email }); // Không trả PasswordHash.
    }

    // GET /api/auth/me - kiểm tra phiên thật bằng cookie + user trong DB.
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return Unauthorized();

        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        return user is null ? Unauthorized() : Ok(new { user.Id, user.Email });
    }

    // POST /api/auth/logout - hủy cookie xác thực trên browser.
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }
}
