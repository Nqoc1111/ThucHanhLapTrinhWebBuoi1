import { Link } from 'react-router';

const services = [
  { icon: '01', title: 'Đăng ký nhanh', description: 'Chọn chuyên khoa, ngày và khung giờ thuận tiện ngay trên website.' },
  { icon: '02', title: 'Tìm bác sĩ', description: 'Tham khảo các bác sĩ và chuyên khoa trước khi đặt lịch.' },
  { icon: '03', title: 'Giao diện thân thiện', description: 'Dễ sử dụng trên máy tính, máy tính bảng và điện thoại.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">CHĂM SÓC SỨC KHỎE THÔNG MINH</span>
            <h1>Đặt lịch khám bệnh <span>thuận tiện</span>, tiết kiệm thời gian</h1>
            <p className="lead">MediBook giúp bạn tham khảo chuyên khoa và đăng ký lịch khám chỉ trong vài bước đơn giản.</p>
            <div className="hero-actions">
              <Link to="/booking" className="btn btn-primary">Đăng ký khám ngay →</Link>
              <Link to="/doctors" className="btn btn-outline">Xem danh sách bác sĩ</Link>
            </div>
            <div className="hero-note">✓ Dễ thao tác &nbsp; ✓ Chủ động thời gian &nbsp; ✓ Giao diện trực quan</div>
          </div>
          <div className="hero-art" aria-label="Minh họa quy trình đặt lịch khám">
            <div className="art-circle art-circle-one" />
            <div className="art-circle art-circle-two" />
            <div className="appointment-preview">
              <div className="preview-top"><span className="preview-logo">✚</span><span>Đặt lịch khám</span><span className="preview-dots">•••</span></div>
              <div className="preview-line"><span className="mini-icon">♙</span><div><small>Chuyên khoa</small><strong>Nội tổng quát</strong></div><span>✓</span></div>
              <div className="preview-line"><span className="mini-icon">▦</span><div><small>Thời gian</small><strong>Chọn lịch phù hợp</strong></div><span>✓</span></div>
              <div className="preview-line"><span className="mini-icon">♡</span><div><small>Trạng thái</small><strong>Điền thông tin đăng ký</strong></div><span>→</span></div>
              <Link to="/booking" className="preview-button">Bắt đầu đăng ký</Link>
            </div>
            <div className="floating-label">✦ Chăm sóc sức khỏe dễ dàng</div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">TÍNH NĂNG NỔI BẬT</span>
          <h2>Trải nghiệm đăng ký khám đơn giản hơn</h2>
          <p>Từ tìm hiểu thông tin đến gửi yêu cầu lịch khám, mọi bước đều rõ ràng.</p>
        </div>
        <div className="feature-grid">
          {services.map((service) => (
            <article className="feature-card" key={service.title}>
              <div className="feature-number">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container cta-band">
        <div>
          <span className="eyebrow">BẮT ĐẦU NGAY</span>
          <h2>Chủ động lựa chọn thời gian khám phù hợp</h2>
          <p>Trải nghiệm quy trình đăng ký lịch khám mẫu ngay hôm nay.</p>
        </div>
        <Link to="/booking" className="btn btn-light">Đặt lịch khám →</Link>
      </section>
    </>
  );
}
