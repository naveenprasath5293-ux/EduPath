import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { ROUTES } from '../constants/routePaths';

/**
 * Generic route guard: requires authentication, and optionally a
 * specific role. StudentRoute and AdminRoute are thin, readable
 * wrappers around this so route configs stay self-documenting while
 * the actual guard logic lives in one place (DRY).
 *
 * @param {string} [role] - if provided, the user's role must match
 * @param {string} redirectTo - where to send unauthenticated users
 * @param {string} unauthorizedRedirectTo - where to send wrong-role users
 */
export default function ProtectedRoute({
  role,
  redirectTo = ROUTES.STUDENT_LOGIN,
  unauthorizedRedirectTo = ROUTES.HOME,
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={unauthorizedRedirectTo} replace />;
  }

  return <Outlet />;
}
