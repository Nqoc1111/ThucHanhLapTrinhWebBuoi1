using ClinicAppointment.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký controller và EF Core.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ClinicDatabase")));

// 2. Chỉ cho frontend của bài thực hành gọi API từ trình duyệt.
const string FrontendCors = "FrontendCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCors, policy => policy
        .WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseRouting();
app.UseCors(FrontendCors);
app.MapControllers();
app.MapGet("/", () => Results.Ok(new { message = "ClinicAppointment API is running" }));
app.Run();
