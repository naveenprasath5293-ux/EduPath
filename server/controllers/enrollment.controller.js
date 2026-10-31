const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const enrollmentService = require('../services/enrollment.service');

/**
 * POST /api/enrollments
 * Student enrolls in a course
 */
const enroll = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user._id; // From authenticated middleware

  const enrollment = await enrollmentService.enrollStudent(studentId, courseId);

  return new ApiResponse(201, 'Enrolled successfully', enrollment).send(res);
});

/**
 * GET /api/enrollments/my-courses
 * Student views their enrolled courses
 */
const getMyCourses = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const enrollments = await enrollmentService.getMyCourses(studentId);

  return new ApiResponse(200, 'My courses retrieved', enrollments).send(res);
});

/**
 * GET /api/enrollments/check/:courseId
 * Check if student is enrolled in a course
 */
const checkEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  const enrollment = await enrollmentService.checkEnrollment(studentId, courseId);

  return new ApiResponse(200, 'Enrollment status retrieved', {
    isEnrolled: !!enrollment,
    enrollment,
  }).send(res);
});

/**
 * GET /api/enrollments/:id
 * Get enrollment details
 */
const getEnrollment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const enrollment = await enrollmentService.getEnrollmentById(id, req.user);

  return new ApiResponse(200, 'Enrollment retrieved', enrollment).send(res);
});

/**
 * PATCH /api/enrollments/:id/progress
 * Update enrollment progress
 */
const updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  const enrollment = await enrollmentService.updateProgress(id, progress, req.user);

  return new ApiResponse(200, 'Progress updated', enrollment).send(res);
});

/**
 * GET /api/enrollments/course/:courseId
 * Admin: Get all students enrolled in a course
 */
const getCourseEnrollments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { page, limit } = req.query;

  const data = await enrollmentService.getCourseEnrollments(courseId, { page, limit });

  return new ApiResponse(200, 'Course enrollments retrieved', data).send(res);
});

/**
 * GET /api/enrollments/stats
 * Admin: Get enrollment statistics
 */
const getEnrollmentStats = asyncHandler(async (req, res) => {
  const stats = await enrollmentService.getEnrollmentStats();

  return new ApiResponse(200, 'Enrollment statistics retrieved', stats).send(res);
});

module.exports = {
  enroll,
  getMyCourses,
  checkEnrollment,
  getEnrollment,
  updateProgress,
  getCourseEnrollments,
  getEnrollmentStats,
};
