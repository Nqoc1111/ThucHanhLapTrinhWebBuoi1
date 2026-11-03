import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  loginAccount,
  logoutAccount,
} from '../services/authApi.js';

const AuthContext = createContext(null);
const PROFILE_KEY = 'medibook.profile';

// localStorage chỉ lưu id/email để minh hoạ và hiển thị.
// KHÔNG dùng dữ liệu này để quyết định người dùng đã đăng nhập hay chưa.
function readCachedProfile() {
  try {
    const item = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
    return item && Number.isInteger(item.id) && typeof item.email === 'string'
      ? { id: item.id, email: item.email }
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user thật được Backend /me xác minh
  const [cachedProfile, setCachedProfile] = useState(readCachedProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function updateProfile(nextUser) {
    setUser(nextUser);
    setCachedProfile(nextUser);
    if (nextUser) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        id: nextUser.id, email: nextUser.email,
      }));
    } else {
      localStorage.removeItem(PROFILE_KEY);
    }
  }

  useEffect(() => {
    let active = true;
    async function verifySession() {
      try {
        const { data } = await getCurrentUser(); // Cookie gửi tự động qua Axios
        if (active) updateProfile(data);
      } catch (err) {
        if (!active) return;
        setUser(null);
        if (err.response?.status === 401) {
          // localStorage cũ không được quyền duy trì phiên khi cookie đã hết hạn.
          localStorage.removeItem(PROFILE_KEY);
          setCachedProfile(null);
        } else {
          setError('Không kiểm tra được phiên. Hãy bật Backend tại cổng 5050.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    verifySession();
    return () => { active = false; };
  }, []);

  async function login(email, password) {
    const { data } = await loginAccount({ email, password });
    updateProfile(data);
    setError('');
    return data;
  }

  async function logout() {
    // Chỉ xóa trạng thái local khi Backend xác nhận xóa cookie.
    await logoutAccount();
    updateProfile(null);
  }

  const value = useMemo(() => ({
    user, cachedProfile, loading, error, login, logout,
  }), [user, cachedProfile, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được gọi trong AuthProvider');
  return context;
}
