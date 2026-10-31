/**
 * Single source of truth for route paths.
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  COURSES: '/courses',
  COURSE_DETAILS: '/courses/:slug',
  CONTACT: '/contact',
  FAQ: '/faq',

  STUDENT_LOGIN: '/student/login',
  STUDENT_REGISTER: '/student/register',
  STUDENT_DASHBOARD: '/student/dashboard',

  // Course learning page
  COURSE_LEARN: '/student/courses/:courseId/learn',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_COURSE_LIST: '/admin/courses',
  ADMIN_COURSE_ADD: '/admin/courses/new',
  ADMIN_COURSE_EDIT: '/admin/courses/:id/edit',
  ADMIN_COURSE_DETAILS: '/admin/courses/:id',

  NOT_FOUND: '*',
};

/** Build the actual learning path with a real courseId */
export function buildLearnPath(courseId) {
  return `/student/courses/${courseId}/learn`;
}

export default ROUTES;
