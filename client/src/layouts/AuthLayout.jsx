import { Outlet } from 'react-router-dom';

/**
 * Bare layout for auth pages (login, register) —
 * no Navbar, no Footer so split-screen can fill 100vh cleanly.
 */
export default function AuthLayout() {
  return <Outlet />;
}
