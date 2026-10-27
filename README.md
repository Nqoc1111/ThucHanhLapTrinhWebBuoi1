# MediBook – Bài thực hành 1 + 2 (ReactJS + ASP.NET Core Web API)

**Đề tài:** Web hỗ trợ đăng ký khám bệnh Online.

Đây là bản mô phỏng học tập. Không có xác thực/ủy quyền, không đáp ứng yêu cầu bảo vệ dữ liệu sức khỏe của một hệ thống triển khai thực tế. Chỉ dùng thông tin giả lập.

## Chức năng

- Bài 1: React/Vite, CSS, React Router (`/`, `/about-us`, `/doctors`, `/booking`).
- Bài 2: API Controller ASP.NET Core, GET/POST/PUT/DELETE lịch đăng ký, Axios, EF Core + SQLite Migration.
- `/booking`: POST tạo lịch.
- `/appointments`: GET danh sách, GET chi tiết, PUT sửa ghi chú, DELETE xóa lịch.

## Yêu cầu môi trường

- Node.js hỗ trợ Vite trong `package.json`.
- .NET SDK 10.x (`dotnet --version` phải chạy được).
- VS Code, Git.

## 1. Chạy backend

Mở **Terminal 1** từ thư mục `clinic-appointment`:

```powershell
cd backend\ClinicAppointment.Api
dotnet restore
dotnet tool install --global dotnet-ef --version 10.0.0
```

Nếu máy đã có `dotnet-ef`, thay lệnh install bằng:

```powershell
dotnet tool update --global dotnet-ef --version 10.0.0
```

Tạo **Migration lần đầu** và **database** (chỉ tạo migration `InitialCreate` một lần):

```powershell
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Migration được tạo tại thư mục `Migrations/`; cơ sở dữ liệu `clinic.db` trong thư mục API. **Commit các file Migration lên Git, không commit `clinic.db`.**

Khởi động backend:

```powershell
dotnet run --urls "http://localhost:5050"
```

Mở `http://localhost:5050/` để xác nhận API đang hoạt động, và `http://localhost:5050/api/appointments` để kiểm tra GET danh sách (ban đầu `[]`).

## 2. Chạy frontend

Mở **Terminal 2** trong thư mục gốc `clinic-appointment`:

```powershell
npm install
npm run dev
```

Mở `http://localhost:3000/booking`, điền **thông tin giả**, tạo lịch và kiểm tra tại `http://localhost:3000/appointments`.

> Nếu đang dùng thư mục của bài 1, chỉ cần thêm Axios: `npm install axios`.

## 3. Các endpoint trong Controller

| Method | URL | Mục đích | Status thành công |
|---|---|---|---|
| GET | `/api/appointments` | Xem tất cả | `200` |
| GET | `/api/appointments/1` | Xem ID 1 | `200` |
| POST | `/api/appointments` | Tạo lịch | `201` |
| PUT | `/api/appointments/1` | Sửa lịch | `204` |
| DELETE | `/api/appointments/1` | Xóa lịch | `204` |

Ví dụ JSON cho **POST** (đặt `date` là một ngày trong tương lai tại thời điểm chạy):

```json
{
  "patientName": "Nguyen Van A",
  "phone": "0901234567",
  "department": "Nội tổng quát",
  "date": "2027-01-20",
  "time": "08:00",
  "note": "Du lieu gia lap cho bai thuc hanh"
}
```

File `backend/ClinicAppointment.Api/requests.http` chứa sẵn ví dụ GET, POST, PUT, DELETE cho REST Client trong VS Code.

## 4. Axios trên giao diện

Các hàm trong `src/services/appointmentApi.js`:

```js
getAppointments();              // GET
getAppointment(1);               // GET /1
createAppointment(form);         // POST
updateAppointment(1, form);      // PUT
 deleteAppointment(1);           // DELETE
```

Cấu hình URL mặc định `http://localhost:5050/api`; có thể sao chép `.env.example` sang `.env` để đổi `VITE_API_URL` nếu backend chạy khác cổng.

## 5. EF Core và cấu hình kết nối

- `backend/ClinicAppointment.Api/ClinicAppointment.Api.csproj`: hai NuGet packages EF Core SQLite + Design phiên bản 10.0.0.
- `backend/ClinicAppointment.Api/appsettings.json`: `ConnectionStrings:ClinicDatabase = Data Source=clinic.db`.
- `backend/ClinicAppointment.Api/Data/AppDbContext.cs`: ánh xạ `Appointments` thành bảng.
- `backend/ClinicAppointment.Api/Program.cs`: DI `AddDbContext(...UseSqlite(...))` và CORS chỉ cho `localhost:3000`.
- Khi thay đổi model trong những bài tiếp theo: `dotnet ef migrations add TenThayDoi`, rồi `dotnet ef database update`.

## 6. Các lỗi thường gặp

| Hiện tượng | Cách kiểm tra |
|---|---|
| `'dotnet' is not recognized` | Cài .NET SDK 10 và mở lại terminal. |
| `dotnet ef` không được nhận diện | Cài/cập nhật global tool `dotnet-ef` 10.0.0, khởi động lại terminal. |
| `no such table: Appointments` | Tại thư mục API chạy `dotnet ef database update`. |
| `Network Error` trong Axios | Backend đã bật cổng `5050` chưa? Có lỗi kết nối CORS trên Console? |
| CORS error | Frontend phải chạy từ `http://localhost:3000` hoặc `http://127.0.0.1:3000`, backend phải bật. |
| `Add-Migration` không có | Dùng `dotnet ef migrations add` trong terminal; không nhầm với Visual Studio Package Manager Console. |
| Thêm migrate `InitialCreate` lần 2 | Không tạo lại, dùng migration đã có; chỉ tạo migration mới khi model thay đổi. |

## 7. Push cập nhật lên GitHub cũ

Ở thư mục gốc `clinic-appointment`:

```powershell
git status
git add .
git commit -m "Lab 2: ASP.NET Core CRUD API, Axios, EF Core SQLite"
git push -u origin main
```

Nếu `git status` thấy `clinic.db` xuất hiện, không commit database chứa thông tin thực tế; file này đã được `.gitignore` tại thư mục backend.

Địa chỉ dự kiến: `https://github.com/Nqoc1111/ThucHanhLapTrinhWebBuoi1`.
