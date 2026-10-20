import { useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { departments } from '../data/doctors.js';

const initialForm = {
  patientName: '',
  phone: '',
  department: '',
  date: '',
  time: '',
  note: '',
};

function localDateISO() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('department') || '';
  const selectedDepartment = departments.includes(requested) ? requested : '';
  const [form, setForm] = useState({ ...initialForm, department: selectedDepartment });
  const [submitted, setSubmitted] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSubmitted(false);
  };

  const submit = (event) => {
    event.preventDefault();
    // Frontend demo: chỉ hiển thị thông báo, không gửi thông tin đến server.
    setSubmitted(true);
  };

  return (
    <section className="page-section container">
      <div className="page-header">
        <span className="eyebrow">ĐĂNG KÝ KHÁM BỆNH</span>
        <h1>Đặt lịch khám trực tuyến</h1>
        <p>Điền thông tin bên dưới để thử nghiệm giao diện đăng ký khám.</p>
      </div>
      <div className="booking-layout">
        <form className="content-card booking-form" onSubmit={submit}>
          <h2>Thông tin đăng ký</h2>
          <p className="form-intro">Các trường có dấu * là bắt buộc.</p>
          <div className="form-grid">
            <label>
              Họ và tên *
              <input name="patientName" value={form.patientName} onChange={update} placeholder="Nhập họ và tên" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Số điện thoại *
              <input name="phone" value={form.phone} onChange={update} type="tel" inputMode="tel" placeholder="Nhập số điện thoại" autoComplete="tel" required pattern="0[0-9]{9}" title="Nhập số điện thoại Việt Nam gồm 10 chữ số, bắt đầu bằng 0" />
            </label>
            <label>
              Chuyên khoa *
              <select name="department" value={form.department} onChange={update} required>
                <option value="">-- Chọn chuyên khoa --</option>
                {departments.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label>
              Ngày khám *
              <input name="date" type="date" min={localDateISO()} value={form.date} onChange={update} required />
            </label>
            <label>
              Khung giờ *
              <select name="time" value={form.time} onChange={update} required>
                <option value="">-- Chọn khung giờ --</option>
                <option value="08:00">08:00</option>
                <option value="09:30">09:30</option>
                <option value="13:30">13:30</option>
                <option value="15:00">15:00</option>
              </select>
            </label>
          </div>
          <label className="form-note-label">
            Ghi chú (không bắt buộc)
            <textarea name="note" value={form.note} onChange={update} rows="3" maxLength={300} placeholder="Ghi chú chung (không nhập thông tin sức khỏe nhạy cảm)" />
          </label>
          <button type="submit" className="btn btn-primary submit-btn">Gửi yêu cầu đăng ký →</button>
          {submitted && (
            <div role="status" className="success-notice">
              <strong>Đã hoàn thành thao tác trên giao diện!</strong>
              <p>Đây là bản demo. Yêu cầu chưa được gửi tới cơ sở y tế và chưa tạo lịch hẹn thực tế.</p>
            </div>
          )}
        </form>
        <aside className="booking-info">
          <span className="booking-info-icon" aria-hidden="true">✚</span>
          <h2>Quy trình 3 bước</h2>
          <div className="step"><span>1</span><div><strong>Chọn chuyên khoa</strong><p>Xác định loại dịch vụ muốn đăng ký.</p></div></div>
          <div className="step"><span>2</span><div><strong>Chọn thời gian</strong><p>Điền ngày khám và khung giờ mong muốn.</p></div></div>
          <div className="step"><span>3</span><div><strong>Gửi thông tin</strong><p>Thử gửi biểu mẫu trong bản demo.</p></div></div>
          <p className="side-note">Bài tập frontend: không có hệ thống xác nhận lịch khám thực tế. Không nhập dữ liệu bệnh nhân thật.</p>
          <Link to="/doctors" className="text-link">← Xem danh sách bác sĩ</Link>
        </aside>
      </div>
    </section>
  );
}
