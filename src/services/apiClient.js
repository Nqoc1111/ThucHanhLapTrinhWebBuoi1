import axios from 'axios';

// Dùng chung một Axios instance cho Auth và Appointment.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  timeout: 10000,
  withCredentials: true, // Gửi/nhận cookie HttpOnly giữa localhost:3000 và localhost:5050.
});

export default api;
