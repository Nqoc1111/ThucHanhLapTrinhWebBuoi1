import api from './apiClient.js';

export const registerAccount = (data) => api.post('/auth/register', data);
export const loginAccount = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');
export const logoutAccount = () => api.post('/auth/logout');

// Nhiều lỗi validation từ ASP.NET Core có dạng { errors: { Email: [...] } }.
export function apiErrorMessage(error, fallback = 'Có lỗi xảy ra, vui lòng thử lại.') {
  const response = error.response?.data;
  if (response?.errors) return Object.values(response.errors).flat().join('; ');
  return response?.message || fallback;
}
