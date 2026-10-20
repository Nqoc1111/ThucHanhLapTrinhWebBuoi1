# MediBook – Website hỗ trợ đăng ký khám bệnh Online

Bài tập môn học ReactJS + Vite + CSS + React Router. Các trang con dùng routing phía client.

> Đây là bản mô phỏng frontend. Danh sách bác sĩ là dữ liệu minh họa; form đăng ký khám **không gửi dữ liệu tới server**, không có khả năng tạo lịch hẹn thật. Không nhập dữ liệu bệnh nhân thật.

## Yêu cầu

- Node.js >= 20.19 hoặc >= 22.12 và npm.
- VS Code (khuyến nghị).

## Chạy trên máy

```powershell
npm install
npm run dev
```

Mở: http://localhost:3000

## Các đường dẫn kiểm thử

| Đường dẫn | Trang |
| --- | --- |
| `/` | Trang chủ |
| `/about-us` | Giới thiệu |
| `/doctors` | Danh sách bác sĩ |
| `/booking` | Form đăng ký khám |
| `/khong-ton-tai` | Trang 404 |

Thử click menu, truy cập trực tiếp URL con và refresh bằng F5. Trên Vite dev server, BrowserRouter được hỗ trợ fallback về `index.html` khi truy cập trực tiếp URL.

## Cấu trúc chính

```text
src/
  components/
    Header.jsx
    Footer.jsx
  data/
    doctors.js
  pages/
    Home.jsx
    About.jsx
    Doctors.jsx
    Booking.jsx
    NotFound.jsx
  App.jsx
  main.jsx
  styles.css
```

## Build

```powershell
npm run build
npm run preview
```

Lưu ý: Khi triển khai ra hosting tĩnh, cần cấu hình fallback của máy chủ về `index.html` cho các URL React Router. Vite dev server đã hỗ trợ việc này.

## Đẩy lên GitHub (username: Nqoc1111)

1. Đăng nhập https://github.com/Nqoc1111, tạo repository mới tên `clinic-appointment`, chọn **Public** và không tích chọn tạo sẵn README/.gitignore (dự án có các file này).
2. Mở terminal trong thư mục có file `package.json` và chạy:

```powershell
git init
git add .
git commit -m "Initial React Vite clinic appointment UI"
git branch -M main
git remote add origin https://github.com/Nqoc1111/clinic-appointment.git
git push -u origin main
```

3. Nếu Git yêu cầu xác thực, đăng nhập GitHub qua Git Credential Manager/trình duyệt. Không sử dụng mật khẩu tài khoản GitHub trực tiếp trong terminal.
4. Sau khi push thành công, link nộp là `https://github.com/Nqoc1111/clinic-appointment`.

## Đối chiếu 7 yêu cầu

1. Tạo project ReactJS bằng Vite: `package.json`, `vite.config.js`.
2. Trang chủ dùng JSX tương đương HTML: `src/pages/Home.jsx`.
3. CSS: `src/styles.css`.
4. Repository GitHub: tự khởi tạo/push theo hướng dẫn ở trên.
5. Components và pages: `src/components`, `src/pages`.
6. React Router: cài `react-router`, dùng `<BrowserRouter>` trong `src/main.jsx`.
7. Đổi trang bằng menu và URL trực tiếp: `<Routes>` trong `src/App.jsx` và `<NavLink>` trong Header.
