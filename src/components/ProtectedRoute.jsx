import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container auth-loading">Đang xác minh phiên đăng nhập...</div>;
  if (!user) {
    return (
      <div>
        {error && <p className="container auth-connection-error" role="alert">{error}</p>}
        <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
      </div>
    );
  }
  return children;
}
