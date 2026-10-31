import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants/routePaths';

/** Requires login AND the 'student' role. */
export default function StudentRoute() {
  return <ProtectedRoute role="student" redirectTo={ROUTES.STUDENT_LOGIN} />;
}
