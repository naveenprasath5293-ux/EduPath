import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants/routePaths';

/** Requires login AND the 'admin' role. */
export default function AdminRoute() {
  return <ProtectedRoute role="admin" redirectTo={ROUTES.ADMIN_LOGIN} />;
}
