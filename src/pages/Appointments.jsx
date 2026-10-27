import { useCallback, useEffect, useState } from 'react';
import {
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentApi.js';

function errorMessage(err) {
  return err.response?.data?.message || 'Không thể kết nối API. Kiểm tra Backend (http://localhost:5050).';
}

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      const response = await getAppointments(); // Axios GET
      setItems(response.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function showDetails(id) {
    setError('');
    try {
      const response = await getAppointment(id); // Axios GET theo ID
      setSelected(response.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function beginEdit(item) {
    setEditing(item);
    setNote(item.note || '');
    setMessage('');
  }

  async function saveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateAppointment(editing.id, {
        patientName: editing.patientName,
        phone: editing.phone,
        department: editing.department,
        date: editing.date,
        time: editing.time,
        note,
      }); // Axios PUT
      setEditing(null);
      setSelected(null);
      setMessage('Đã cập nhật ghi chú bằng PUT.');
      await refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm(`Xóa vĩnh viễn lịch đăng ký #${id} khỏi cơ sở dữ liệu demo?`)) return;
    setError('');
    setMessage('');
    try {
      await deleteAppointment(id); // Axios DELETE
      setSelected(null);
      if (editing?.id === id) setEditing(null);
      setMessage(`Đã xóa lịch #${id} bằng DELETE.`);
      await refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <section className="page-section container">
      <div className="page-header">
        <span className="eyebrow">THỰC HÀNH API CRUD</span>
        <h1>Quản lý lịch đăng ký khám</h1>
        <p>Bảng dữ liệu được lấy trực tiếp từ ASP.NET Core API qua Axios.</p>
      </div>
      <div className="appointments-layout">
        <div className="content-card">
          <h2>Danh sách lịch (GET)</h2>
          <p className="appointments-description">Dữ liệu chỉ dùng để học tập. Hãy nhập tên/số điện thoại giả lập, không sử dụng thông tin bệnh nhân thật.</p>
          <button className="action-button" onClick={refresh}>↻ Tải lại danh sách</button>
          {loading && <p>Đang tải...</p>}
          {error && <div role="alert" className="error-notice">{error}</div>}
          {message && <div role="status" className="success-notice">{message}</div>}
          {!loading && items.length === 0 && !error && <p>Chưa có lịch đăng ký. Hãy tạo lịch tại menu Đăng ký khám.</p>}
          {items.length > 0 && (
            <div className="appointments-table-wrap">
              <table className="appointments-table">
                <thead><tr><th>Mã</th><th>Họ tên (mẫu)</th><th>Chuyên khoa</th><th>Ngày</th><th>Giờ</th><th>Thao tác</th></tr></thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a.id}>
                      <td>#{a.id}</td><td>{a.patientName}</td><td>{a.department}</td><td>{a.date}</td><td>{a.time}</td>
                      <td><div className="action-buttons">
                        <button className="action-button" onClick={() => showDetails(a.id)}>Chi tiết (GET)</button>
                        <button className="action-button" onClick={() => beginEdit(a)}>Sửa (PUT)</button>
                        <button className="action-button danger" onClick={() => remove(a.id)}>Xóa (DELETE)</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editing && (
          <form className="content-card edit-note" onSubmit={saveEdit}>
            <h2>Cập nhật lịch #{editing.id} (PUT)</h2>
            <label htmlFor="edit-note">Ghi chú</label>
            <textarea id="edit-note" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} />
            <div className="edit-note-buttons">
              <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Đang lưu...' : 'Lưu cập nhật'}</button>
              <button className="btn btn-outline" type="button" onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </form>
        )}

        {selected && (
          <div className="content-card details-card">
            <h2>Chi tiết lịch #{selected.id} (GET theo ID)</h2>
            <dl>
              <dt>Họ và tên</dt><dd>{selected.patientName}</dd>
              <dt>Điện thoại demo</dt><dd>{selected.phone}</dd>
              <dt>Chuyên khoa</dt><dd>{selected.department}</dd>
              <dt>Ngày / Giờ</dt><dd>{selected.date} lúc {selected.time}</dd>
              <dt>Ghi chú</dt><dd>{selected.note || '(Không có)'}</dd>
              <dt>Trạng thái</dt><dd>{selected.status}</dd>
            </dl>
            <button className="btn btn-outline" onClick={() => setSelected(null)}>Đóng chi tiết</button>
          </div>
        )}
      </div>
    </section>
  );
}
