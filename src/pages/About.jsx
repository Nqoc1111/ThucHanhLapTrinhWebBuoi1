import { Link } from 'react-router';

export default function About() {
  return (
    <section className="page-section container">
      <div className="page-header">
        <span className="eyebrow">VỀ MEDIBOOK</span>
        <h1>Giới thiệu hệ thống</h1>
        <p>MediBook là website minh họa cho đề tài “Xây dựng Web hỗ trợ đăng ký khám bệnh Online”.</p>
      </div>
      <div className="about-grid">
        <article className="content-card">
          <h2>Mục tiêu của dự án</h2>
          <p>Xây dựng giao diện trực quan giúp người dùng xem thông tin chuyên khoa, tham khảo bác sĩ và gửi yêu cầu đăng ký lịch khám.</p>
          <p>Phiên bản bài tập tập trung vào ReactJS, HTML (JSX), CSS và React Router để chuyển trang không cần tải lại toàn bộ website.</p>
          <Link to="/booking" className="btn btn-primary">Trải nghiệm đặt lịch →</Link>
        </article>
        <aside className="content-card soft-card">
          <h2>Phạm vi hiện tại</h2>
          <ul className="check-list">
            <li>Giao diện trang chủ và giới thiệu</li>
            <li>Danh sách bác sĩ mẫu theo chuyên khoa</li>
            <li>Form đăng ký khám mẫu</li>
            <li>Điều hướng URL với React Router</li>
          </ul>
          <p className="notice">Lưu ý: Đây là giao diện demo, chưa kết nối bệnh viện hoặc hệ thống đặt lịch thật.</p>
        </aside>
      </div>
    </section>
  );
}
