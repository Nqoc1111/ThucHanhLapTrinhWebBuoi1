# MediBook — Bài thực hành tuần 3 (tiếp nối tuần 1 + 2)

## I. Nội dung được bổ sung

- `POST /api/auth/register`: email + password, DataAnnotations, unique email trong SQLite.
- `POST /api/auth/login`: tìm user theo email trong bảng Users, `PasswordHasher.VerifyHashedPassword`, cấp HttpOnly Cookie.
- `GET /api/auth/me`: kiểm tra cookie và truy vấn lại user trong database.
- `POST /api/auth/logout`: huỷ cookie phiên.
- `src/context/AuthContext.jsx`: React Context chứa **trạng thái user đã được xác thực**.
- `localStorage['medibook.profile']`: chỉ chứa `id`, `email` phục vụ cache hiển thị, **không dùng để xác thực**.
- Route `/register`, `/login`, bảo vệ `/booking`, `/appointments`.
- Mọi API CRUD lịch khám đều yêu cầu đăng nhập và ràng buộc theo `OwnerUserId`.

## II. Chép file ZIP cập nhật vào project đang có

1. Sao lưu project `C:\ThucHanhLapTrinhWeb\clinic-appointment`, nhất là `backend\ClinicAppointment.Api\clinic.db`, trước khi sửa.
2. Giải nén `clinic-appointment-lab3-cap-nhat.zip`.
3. **Chỉ** copy thư mục `src`, `backend` và tài liệu `HUONG_DAN_TUAN_3.md` từ thư mục giải nén vào thư mục `clinic-appointment` cũ và chọn Merge / Replace đối với các file đã chỉnh sửa.
4. ZIP cập nhật **không chứa** `clinic.db`, `Migrations` cũ, `.git` hay `ClinicAppointment.Api.csproj`. Như vậy lịch sử Migration, DB và các bản vá NuGet tuần 2 được giữ nguyên.
5. Đừng chép một thư mục `clinic-appointment` lồng bên trong thư mục gốc.

## III. Chuẩn bị

Trên Windows, mở Terminal PowerShell của VS Code, kiểm tra:

```powershell
dotnet --version
node --version
```

.NET SDK cần là phiên bản 10, Node.js là phiên bản tương thích với Vite trong project.

## IV. Tạo EF Core Migration mới (QUAN TRỌNG)

Nếu bạn đã tạo Migration tuần 2 `20261027070919_InitialCreate`, **KHÔNG chạy lại `InitialCreate`** và **KHÔNG xóa `clinic.db`**.

```powershell
cd C:\ThucHanhLapTrinhWeb\clinic-appointment\backend\ClinicAppointment.Api

dotnet restore
dotnet build
dotnet ef migrations list
dotnet ef migrations add AddUsersAndOwnership
dotnet ef database update
dotnet ef migrations list
```

`AddUsersAndOwnership` sẽ tạo bảng `Users`, unique index cho `NormalizedEmail` và thêm cột `OwnerUserId` vào bảng `Appointments`.

**Dữ liệu lịch cũ không bị xóa.** Tuy nhiên, vì các lịch ở tuần 2 chưa gắn với tài khoản nào (`OwnerUserId = NULL`), chúng **không được hiển thị** trong `/appointments` cho user mới — đây là mục đích bảo vệ dữ liệu, không phải lỗi. Hãy đăng ký tài khoản và tạo các lịch mới cho tuần 3.

Chỉ chạy `dotnet ef migrations add AddUsersAndOwnership` **một lần**. Nếu đã có tên migration này, chỉ `dotnet ef database update`.

**Nếu `dotnet build` báo MSB3027 / file DLL đang bị khóa:** dừng terminal Backend đang chạy (`Ctrl+C`) rồi build lại.

## V. Chạy Backend

Terminal 1 trong `backend\ClinicAppointment.Api`:

```powershell
dotnet run --urls "http://localhost:5050"
```

Mở `http://localhost:5050/` thấy thông báo API đang chạy.

**Lưu ý:** `http://localhost:5050/api/appointments` trả `401 Unauthorized` khi chưa đăng nhập là **đúng yêu cầu tuần 3**. Ở tuần 2 endpoint này mở công khai nhưng tuần 3 phải bảo vệ.

## VI. Chạy Frontend

Terminal 2 trong thư mục gốc `clinic-appointment`:

```powershell
cd C:\ThucHanhLapTrinhWeb\clinic-appointment
npm install
npm run dev -- --port 3000
```

Mở **http://localhost:3000**. Dùng `localhost` cho cả hai cổng, không trộn `127.0.0.1` vào cùng phiên test vì cookie có thể không được gửi.

Truy cập:
- `/register`: tạo user (email, password, xác nhận password).
- `/login`: đăng nhập.
- `/booking`: cần đăng nhập.
- `/appointments`: cần đăng nhập, chỉ hiển thị lịch của user hiện tại.

## VII. Giải thích code chính

### 1. Backend
- `Models/AppUser.cs`: entity map tới bảng `Users`, có `Email`, `NormalizedEmail`, `PasswordHash` và `CreatedAtUtc`.
- `Models/RegisterRequest.cs`, `LoginRequest.cs`: DTO, xác thực email/mật khẩu trước khi vào Controller.
- `Data/AppDbContext.cs`: thêm `DbSet<AppUser> Users` và unique index tránh trùng email.
- `Controllers/AuthController.cs`:
  - `Register()`: chuẩn hoá email, kiểm tra trùng, dùng `HashPassword`, gọi `SaveChangesAsync()`.
  - `Login()`: query DB, dùng `VerifyHashedPassword`, `SignInAsync` phát cookie.
  - `Me()`: `[Authorize]`, truy vấn DB theo ID cookie đã xác thực.
  - `Logout()`: `SignOutAsync` huỷ cookie.
- `Program.cs`: `AddAuthentication().AddCookie`, `AddAuthorization`, CORS `.AllowCredentials()`, `UseAuthentication`, `UseAuthorization`. CORS chỉ chấp nhận origin frontend cục bộ.
- `AppointmentsController.cs`: `[Authorize]`; mọi thao tác GET/PUT/DELETE lọc `OwnerUserId`, POST gán chủ sở hữu.

### 2. Frontend
- `src/services/apiClient.js`: Axios với `baseURL` Backend và `withCredentials:true` cho cookie.
- `src/services/authApi.js`: các hàm Axios `registerAccount`, `loginAccount`, `getCurrentUser`, `logoutAccount`.
- `src/context/AuthContext.jsx`:
  - `user`: state React được cấp từ kết quả đăng nhập hoặc `/auth/me`.
  - `login(email,password)`: gọi Backend, cập nhật context + thông tin cache trong localStorage.
  - `logout()`: gọi API và xoá thông tin cache.
  - `useEffect`: sau khi F5, gọi `/auth/me` để xác thực lại cookie; localStorage không tự cấp quyền.
- `src/components/ProtectedRoute.jsx`: nếu chưa đăng nhập, chuyển qua `/login`.
- `src/pages/Register.jsx`, `Login.jsx`: form nhập email/password với kiểm tra Client.
- `src/App.jsx`: thêm route mới và bọc trang CRUD trong `ProtectedRoute`.
- `src/components/Header.jsx`: menu đăng nhập/đăng ký/đăng xuất, email tài khoản.

## VIII. Quy trình test từ đầu đến cuối

### Test 1. Chưa đăng nhập
Truy cập `/booking` hoặc `/appointments` → chuyển đến `/login`.

### Test 2. Validate form
Ở `/register`:
- Email sai cú pháp → browser không cho submit.
- Mật khẩu 7 ký tự → không submit.
- Mật khẩu và nhập lại không khớp → thông báo lỗi.

Frontend chỉ kiểm tra thuận tiện cho người dùng; Backend vẫn phải xác thực độc lập.

### Test 3. Đăng ký
Nhập `testuser1@example.com` và mật khẩu giả lập đủ 8 ký tự. Network: POST `/api/auth/register` → `201 Created`. Gửi lại cùng email → `409 Conflict`.

### Test 4. Đăng nhập
Dùng password sai → POST `/api/auth/login` → `401 Unauthorized`.
Dùng đúng password → POST `/api/auth/login` → `200 OK`.

### Test 5. Context + localStorage + cookie
Sau khi login:
1. Header hiện email.
2. Mở F12 → Application → Local Storage → `http://localhost:3000`: có `medibook.profile` chứa **id, email**, không có mật khẩu.
3. F12 → Application → Cookies → `http://localhost:5050`: cookie `MediBook.Auth` HttpOnly (tên và nơi hiển thị phụ thuộc trình duyệt).
4. F5 → `/auth/me` trả `200`, header vẫn hiện email.
5. Thử tự sửa `medibook.profile` trong DevTools: quyền truy cập không thay đổi, vì Backend kiểm tra cookie.

### Test 6. CRUD lịch gắn user
Đăng nhập user A → tạo lịch ở `/booking`, xem tại `/appointments`, thử GET/PUT/DELETE. Network phản hồi 201 / 200 / 204.

### Test 7. Cách ly giữa hai tài khoản
Tạo user B ở cửa sổ ẩn danh. User B không thấy lịch của A. Nếu user B GET `/api/appointments/{id-cua-A}` thì trả `404` (không lộ tài nguyên người khác).

### Test 8. Logout
Nhấn Đăng xuất → POST `/auth/logout` → 204; vào `/appointments` bị chuyển về login. F5 vẫn chưa đăng nhập.

### Test 9. Database
Kiểm tra Migration:

```powershell
cd C:\ThucHanhLapTrinhWeb\clinic-appointment\backend\ClinicAppointment.Api
dotnet ef migrations list
Get-ChildItem .\clinic.db
```

Để chứng minh bảng Users thật sự lưu password hash, có thể xem bằng công cụ SQLite (không chia sẻ email/password thực). Hãy xác nhận `PasswordHash` có giá trị dạng hash, không phải password vừa nhập.

## IX. HTTP status mong đợi

| API | Method | Thành công | Lỗi thường gặp |
|---|---|---:|---|
| `/api/auth/register` | POST | 201 | 400 dữ liệu không hợp lệ, 409 trùng email |
| `/api/auth/login` | POST | 200 | 401 sai thông tin |
| `/api/auth/me` | GET | 200 | 401 chưa login |
| `/api/auth/logout` | POST | 204 | — |
| `/api/appointments` | GET | 200 | 401 chưa login |
| `/api/appointments` | POST | 201 | 400 dữ liệu sai, 401 chưa login |
| `/api/appointments/{id}` | PUT | 204 | 401 chưa login, 404 không có quyền/xóa |
| `/api/appointments/{id}` | DELETE | 204 | 401 chưa login, 404 không có quyền/xóa |

## X. Push source code lên GitHub

Tại thư mục gốc:

```powershell
cd C:\ThucHanhLapTrinhWeb\clinic-appointment
git status
git add .
git status
git commit -m "Lab 3: register login validation React Context and cookie auth"
git push origin main
```

Repo: https://github.com/Nqoc1111/ThucHanhLapTrinhWebBuoi1

Chỉ push `Migrations` mới, các file code và tài liệu. KHÔNG push `clinic.db`, `*.db-wal`, `.env` có secrets, `node_modules`, `bin`, `obj`.

## XI. Phạm vi và hạn chế bảo mật

Bản tuần 3 là **lab**, không phải hệ thống y tế production. Cookie HttpOnly + SameSite Strict và kiểm tra Origin là các lớp bảo vệ cơ bản. Khi triển khai Internet cần bổ sung CSRF token có thiết kế bài bản, HTTPS, chống brute force/rate-limit, xác minh email, reset password an toàn, quyền admin, audit log và chính sách bảo vệ dữ liệu sức khoẻ.

Mật khẩu nên đủ dài và duy nhất. `EmailAddress` chỉ kiểm tra định dạng, **không chứng minh email thuộc về người đăng ký**. Cần xác minh quyền sở hữu email nếu triển khai thực tế.
