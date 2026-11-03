import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/about-us', label: 'Giới thiệu' },
  { to: '/doctors', label: 'Bác sĩ' },
  { to: '/booking', label: 'Đăng ký khám' },
  { to: '/appointments', label: 'Quản lý lịch' },
];

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onLogout() {
    setLoggingOut(true);
    setError('');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      setError('Không thể đăng xuất. Kiểm tra kết nối Backend.');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" aria-label="MediBook - Trang chủ">
          <span className="brand-icon" aria-hidden="true">+</span>
          <span>Medi<span className="brand-highlight">Book</span></span>
        </NavLink>
        <nav aria-label="Điều hướng chính" className="nav-links">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="auth-nav">
          {loading ? <span className="auth-small">Kiểm tra phiên...</span> : user ? (
            <>
              <span className="auth-email" title={user.email}>{user.email}</span>
              <button className="auth-logout" onClick={onLogout} disabled={loggingOut}>
                {loggingOut ? 'Đang thoát...' : 'Đăng xuất'}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Đăng nhập</NavLink>
              <NavLink to="/register" className="auth-register-link">Đăng ký</NavLink>
            </>
          )}
        </div>
      </div>
      {error && <div className="container auth-nav-error" role="alert">{error}</div>}
    </header>
  );
}
