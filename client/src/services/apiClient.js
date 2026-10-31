import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AUTH_UNAUTHORIZED_EVENT = 'scm:auth-unauthorized';

/**
 * Shared Axios instance. withCredentials is required so the httpOnly
 * auth cookie set by the backend is sent on every request.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// On a 401 from any protected endpoint, broadcast a DOM event instead
// of importing AuthContext directly (avoids a circular dependency).
// AuthContext listens for this and clears its user state.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login') && !error.config?.url?.includes('/auth/register') && !error.config?.url?.includes('/auth/admin/login')) {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
