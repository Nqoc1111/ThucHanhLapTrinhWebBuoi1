import { NavLink } from 'react-router';

const links = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/about-us', label: 'Giới thiệu' },
  { to: '/doctors', label: 'Bác sĩ' },
  { to: '/booking', label: 'Đăng ký khám' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" aria-label="MediBook - Trang chủ">
          <span className="brand-icon" aria-hidden="true">+</span>
          <span>Medi<span className="brand-highlight">Book</span></span>
        </NavLink>
        <nav aria-label="Điều hướng chính" className="nav-links">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
