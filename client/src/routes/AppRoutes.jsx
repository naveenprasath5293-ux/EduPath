import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/ui/Loader';
import StudentRoute from './StudentRoute';
import AdminRoute from './AdminRoute';
import { ROUTES } from '../constants/routePaths';

// Public pages
const Home = lazy(() => import('../pages/public/Home'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const Courses = lazy(() => import('../pages/student/Courses'));
const CourseView = lazy(() => import('../pages/student/CourseView'));

// Auth pages — full-screen split layout
const StudentLogin = lazy(() => import('../pages/student/StudentLogin'));
const StudentRegister = lazy(() => import('../pages/student/StudentRegister'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));

// Authenticated student pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const CourseLearning = lazy(() => import('../pages/student/CourseLearning'));

// Authenticated admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CourseList = lazy(() => import('../pages/admin/CourseList'));
const AddCourse = lazy(() => import('../pages/admin/AddCourse'));
const EditCourse = lazy(() => import('../pages/admin/EditCourse'));
const AdminCourseDetails = lazy(() => import('../pages/admin/CourseDetails'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public — Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.COURSES} element={<Courses />} />
          <Route path={ROUTES.COURSE_DETAILS} element={<CourseView />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.FAQ} element={<FAQ />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>

        {/* Auth — bare full-screen layout */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLogin />} />
          <Route path={ROUTES.STUDENT_REGISTER} element={<StudentRegister />} />
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        </Route>

        {/* Authenticated — MainLayout header */}
        <Route element={<MainLayout />}>
          <Route element={<StudentRoute />}>
            <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
            {/* Course learning — full page, no public navbar */}
            <Route path={ROUTES.COURSE_LEARN} element={<CourseLearning />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_COURSE_LIST} element={<CourseList />} />
            <Route path={ROUTES.ADMIN_COURSE_ADD} element={<AddCourse />} />
            <Route path={ROUTES.ADMIN_COURSE_EDIT} element={<EditCourse />} />
            <Route path={ROUTES.ADMIN_COURSE_DETAILS} element={<AdminCourseDetails />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
