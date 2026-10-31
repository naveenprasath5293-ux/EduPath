import apiClient from './apiClient';

const enrollmentService = {
  // ---- Student routes ----

  /**
   * Enroll in a course
   */
  enroll: (courseId) =>
    apiClient.post('/enrollments', { courseId }).then((res) => res.data),

  /**
   * Get student's enrolled courses
   */
  getMyCourses: () =>
    apiClient.get('/enrollments/my-courses').then((res) => res.data),

  /**
   * Check if enrolled in a specific course
   */
  checkEnrollment: (courseId) =>
    apiClient.get(`/enrollments/check/${courseId}`).then((res) => res.data),

  /**
   * Get enrollment details
   */
  getEnrollment: (id) =>
    apiClient.get(`/enrollments/${id}`).then((res) => res.data),

  /**
   * Update enrollment progress
   */
  updateProgress: (id, progress) =>
    apiClient.patch(`/enrollments/${id}/progress`, { progress }).then((res) => res.data),

  // ---- Admin routes ----

  /**
   * Get all students enrolled in a course
   */
  getCourseEnrollments: (courseId, params) =>
    apiClient.get(`/enrollments/course/${courseId}`, { params }).then((res) => res.data),

  /**
   * Get enrollment statistics
   */
  getEnrollmentStats: () =>
    apiClient.get('/enrollments/stats').then((res) => res.data),
};

export default enrollmentService;
