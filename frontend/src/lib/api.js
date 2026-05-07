import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // token invalid; clear and redirect handled by AuthContext on next read
      const path = window.location.pathname;
      if (path.startsWith('/app')) {
        localStorage.removeItem('ff_token');
        localStorage.removeItem('ff_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export default api;
