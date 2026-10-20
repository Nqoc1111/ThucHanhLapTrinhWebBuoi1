export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>MediBook</strong>
          <p>Đồ án học tập: Website hỗ trợ đăng ký khám bệnh trực tuyến.</p>
        </div>
        <p>© {new Date().getFullYear()} MediBook · Giao diện minh họa</p>
      </div>
    </footer>
  );
}
