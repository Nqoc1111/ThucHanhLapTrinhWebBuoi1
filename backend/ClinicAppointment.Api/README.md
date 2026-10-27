# ClinicAppointment.Api

ASP.NET Core Controller-based Web API (`net10.0`), Entity Framework Core SQLite provider (`10.0.0`).

Chạy từ thư mục này:

```powershell
dotnet restore
dotnet tool install --global dotnet-ef --version 10.0.0
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run --urls "http://localhost:5050"
```

Nếu đã cài `dotnet-ef`, thay `install` bằng `update`. Xem `../../README.md` để biết đầy đủ hướng dẫn và giới hạn bảo mật.
