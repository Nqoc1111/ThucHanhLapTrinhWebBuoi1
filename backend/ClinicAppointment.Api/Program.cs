using ClinicAppointment.Api.Data;
using ClinicAppointment.Api.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ClinicDatabase")));

// Dùng PasswordHasher chuẩn của ASP.NET Core Identity để băm và kiểm tra mật khẩu.
builder.Services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();

// Cookie HttpOnly là nguồn xác thực. localStorage KHÔNG dùng để cấp quyền truy cập.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "MediBook.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        // localhost dùng HTTP để học; deployment thật bắt buộc HTTPS.
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = false;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();

const string frontendCors = "FrontendCors";
string[] trustedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
builder.Services.AddCors(options => options.AddPolicy(frontendCors, policy => policy
    .WithOrigins(trustedOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials())); // Cần để browser gửi và nhận cookie qua Axios.

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors(frontendCors);

// Bảo vệ cơ bản cho những API thay đổi dữ liệu khi dùng cookie.
// CORS không phải cơ chế chống CSRF; ở đây từ chối Origin ngoài danh sách.
app.Use(async (context, next) =>
{
    var method = context.Request.Method;
    var modifying = !HttpMethods.IsGet(method) && !HttpMethods.IsHead(method)
        && !HttpMethods.IsOptions(method);
    if (modifying && context.Request.Path.StartsWithSegments("/api")
        && context.Request.Headers.TryGetValue("Origin", out var origin)
        && !trustedOrigins.Contains(origin.ToString(), StringComparer.Ordinal))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return;
    }
    await next();
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Ok(new { message = "ClinicAppointment API is running - week 3" }));
app.Run();
