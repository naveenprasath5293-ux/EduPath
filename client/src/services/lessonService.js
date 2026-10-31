import apiClient from './apiClient';

/**
 * Lesson service — student and admin operations.
 * Uses the single shared apiClient instance (no duplicate Axios).
 */
const lessonService = {
  // ── Student ──────────────────────────────────────────────────────────────

  /**
   * Get published lessons for a course (student must be enrolled).
   * Returns: { lessons, enrollment }
   */
  getLessons: (courseId) =>
    apiClient.get(`/courses/${courseId}/lessons`).then((r) => r.data),

  /**
   * Mark a lesson as complete. Recalculates real progress on the server.
   * Returns: { lessonId, progress, status, completedLessons, courseCompleted }
   */
  completeLesson: (courseId, lessonId) =>
    apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`).then((r) => r.data),

  // ── Admin ─────────────────────────────────────────────────────────────────

  /** Get all lessons for a course (admin — all publish states). */
  getAdminLessons: (courseId) =>
    apiClient.get(`/admin/courses/${courseId}/lessons`).then((r) => r.data),

  /** Create a new lesson in a course. */
  createLesson: (courseId, payload) =>
    apiClient.post(`/admin/courses/${courseId}/lessons`, payload).then((r) => r.data),

  /** Update an existing lesson. */
  updateLesson: (courseId, lessonId, payload) =>
    apiClient.patch(`/admin/courses/${courseId}/lessons/${lessonId}`, payload).then((r) => r.data),

  /** Delete a lesson permanently. */
  deleteLesson: (courseId, lessonId) =>
    apiClient.delete(`/admin/courses/${courseId}/lessons/${lessonId}`).then((r) => r.data),

  /** Toggle a lesson's published state. */
  togglePublish: (courseId, lessonId) =>
    apiClient.patch(`/admin/courses/${courseId}/lessons/${lessonId}/toggle-publish`).then((r) => r.data),
};

export default lessonService;
