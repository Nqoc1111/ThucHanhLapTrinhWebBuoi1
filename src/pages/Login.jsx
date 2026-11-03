import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { apiErrorMessage } from '../services/authApi.js';

export default function Login() {
  const { user, loading: checkingSession, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const from = typeof location.state?.from === 'string' && location.state.from.startsWith('/')
    && !location.state.from.startsWith('//') ? location.state.from : '/appointments';
  if (!checkingSession && user) return <Navigate to={from} replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Không thể đăng nhập. Kiểm tra Backend tại cổng 5050.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-section container auth-page">
      <div className="page-header auth-heading">
        <span className="eyebrow">MEDIBOOK · TUẦN 3</span>
        <h1>Đăng nhập</h1>
        <p>Đăng nhập để đặt lịch và quản lý lịch khám của tài khoản.</p>
      </div>
      <form className="content-card auth-form" onSubmit={submit}>
        {location.state?.registered && <div className="success-notice" role="status">Tạo tài khoản thành công! Hãy đăng nhập.</div>}
        <label htmlFor="login-email">Email *</label>
        <input id="login-email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="username" placeholder="vidu@example.com" />
        <label htmlFor="login-password">Mật khẩu *</label>
        <input id="login-password" name="password" type="password" required value={password}
          onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p role="alert" className="error-notice">{error}</p>}
        <button className="btn btn-primary" disabled={busy || checkingSession} type="submit">
          {busy ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>
        <p className="auth-alt">Chưa có tài khoản? <Link className="text-link" to="/register">Đăng ký ngay</Link></p>
      </form>
    </section>
  );
}
