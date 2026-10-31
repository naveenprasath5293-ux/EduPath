import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { AUTH_UNAUTHORIZED_EVENT } from '../services/apiClient';

const AuthContext = createContext(null);

// Non-httpOnly marker only used to decide whether it's worth attempting
// a session restore on startup. It carries no auth weight itself - the
// real session lives entirely in the httpOnly cookie and is still
// verified server-side on every request. This just avoids firing a
// GET /auth/profile that is guaranteed to 401 for a visitor who has
// never logged in (e.g. first-ever page load), so that guaranteed,
// uninteresting 401 doesn't show up in the console on every fresh visit.
const SESSION_HINT_KEY = 'scm_had_session';

function setSessionHint() {
  try {
    localStorage.setItem(SESSION_HINT_KEY, '1');
  } catch (err) {
    // localStorage may be unavailable (e.g. private browsing) - safe to ignore.
  }
}

function clearSessionHint() {
  try {
    localStorage.removeItem(SESSION_HINT_KEY);
  } catch (err) {
    // ignore
  }
}

function hadSessionBefore() {
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === '1';
  } catch (err) {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until initial session restore completes

  // Restore session on first load - the httpOnly cookie (if valid) lets
  // /auth/profile succeed even after a full page refresh. If there's no
  // hint that this browser ever had a session, skip the call entirely
  // instead of making a request that's guaranteed to come back 401.
  useEffect(() => {
    let cancelled = false;

    if (!hadSessionBefore()) {
      setIsLoading(false);
      return undefined;
    }

    (async () => {
      try {
        const res = await authService.getProfile();
        if (!cancelled) setUser(res.data.user);
      } catch (err) {
        // Expected whenever the cookie is missing/expired - handled
        // silently. Any session hint from a previous login is now
        // stale, so clear it to avoid retrying on the next load.
        if (!cancelled) {
          setUser(null);
          clearSessionHint();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-logout when any request comes back 401 (expired/invalid cookie).
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      clearSessionHint();
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    setUser(res.data.user);
    setSessionHint();
    return res.data.user;
  }, []);

  const login = useCallback(async (payload) => {
    const res = await authService.login(payload);
    setUser(res.data.user);
    setSessionHint();
    return res.data.user;
  }, []);

  const adminLogin = useCallback(async (payload) => {
    const res = await authService.adminLogin(payload);
    setUser(res.data.user);
    setSessionHint();
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      clearSessionHint();
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await authService.updateProfile(payload);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    register,
    login,
    adminLogin,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
