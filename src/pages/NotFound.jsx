import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="not-found container">
      <span className="not-found-code">404</span>
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn bạn truy cập chưa được định nghĩa trong hệ thống.</p>
      <Link to="/" className="btn btn-primary">Quay về trang chủ</Link>
    </section>
  );
}
