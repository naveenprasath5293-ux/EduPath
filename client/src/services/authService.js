import apiClient from './apiClient';

/**
 * Thin wrapper around the auth endpoints. Cookie-based JWT means we
 * never handle the token directly here - the browser sends/receives
 * the httpOnly cookie automatically (apiClient has withCredentials:true).
 */
const authService = {
  register: (payload) => apiClient.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => apiClient.post('/auth/login', payload).then((res) => res.data),
  adminLogin: (payload) => apiClient.post('/auth/admin/login', payload).then((res) => res.data),
  logout: () => apiClient.post('/auth/logout').then((res) => res.data),
  getProfile: () => apiClient.get('/auth/profile').then((res) => res.data),
  updateProfile: (payload) => apiClient.put('/auth/profile', payload).then((res) => res.data),
};

export default authService;
