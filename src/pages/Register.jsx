import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { apiErrorMessage, registerAccount } from '../services/authApi.js';

export default function Register() {
  const { user, loading: checkingSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!checkingSession && user) return <Navigate to="/appointments" replace />;

  function update(event) {
    setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    if (form.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Hai lần nhập mật khẩu không khớp.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await registerAccount({ email: form.email.trim(), password: form.password });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setError(apiErrorMessage(err, 'Không thể đăng ký. Kiểm tra Backend tại cổng 5050.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-section container auth-page">
      <div className="page-header auth-heading">
        <span className="eyebrow">MEDIBOOK · TUẦN 3</span>
        <h1>Đăng ký tài khoản</h1>
        <p>Tạo tài khoản bằng email và mật khẩu để quản lý các lịch khám của bạn.</p>
      </div>
      <form className="content-card auth-form" onSubmit={submit}>
        <label htmlFor="register-email">Email *</label>
        <input id="register-email" name="email" type="email" value={form.email} onChange={update}
          autoComplete="email" maxLength={254} required placeholder="vidu@example.com" />
        <label htmlFor="register-password">Mật khẩu *</label>
        <input id="register-password" name="password" type="password" value={form.password} onChange={update}
          autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Ít nhất 8 ký tự" />
        <label htmlFor="confirm-password">Nhập lại mật khẩu *</label>
        <input id="confirm-password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={update}
          autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Xác nhận mật khẩu" />
        {error && <p role="alert" className="error-notice">{error}</p>}
        <button className="btn btn-primary" disabled={busy || checkingSession} type="submit">
          {busy ? 'Đang đăng ký...' : 'Tạo tài khoản'}
        </button>
        <p className="auth-alt">Đã có tài khoản? <Link className="text-link" to="/login">Đăng nhập</Link></p>
        <p className="auth-disclaimer">Chỉ dùng tài khoản và thông tin giả lập trong bài học, không dùng dữ liệu bệnh nhân thật.</p>
      </form>
    </section>
  );
}
