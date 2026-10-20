import { Link } from 'react-router';
import { doctors } from '../data/doctors.js';

export default function Doctors() {
  return (
    <section className="page-section container">
      <div className="page-header">
        <span className="eyebrow">CHUYÊN KHOA & BÁC SĨ</span>
        <h1>Danh sách bác sĩ</h1>
        <p>Khám phá các chuyên khoa được minh họa trong hệ thống.</p>
      </div>
      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <article className="doctor-card" key={doctor.id}>
            <div className={`doctor-avatar ${doctor.tone}`} aria-hidden="true">{doctor.initials}</div>
            <span className="specialty">{doctor.department}</span>
            <h2>{doctor.name}</h2>
            <p>{doctor.description}</p>
            <Link to={`/booking?department=${encodeURIComponent(doctor.department)}`} className="btn btn-outline full-width">Đăng ký khám →</Link>
          </article>
        ))}
      </div>
      <p className="disclaimer">* Tất cả hồ sơ bác sĩ trên trang này là dữ liệu giả lập phục vụ bài tập.</p>
    </section>
  );
}
