const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const {
  enrollValidator,
  enrollmentIdValidator,
  courseIdValidator,
  progressValidator,
  paginationValidator,
} = require('../validators/enrollment.validator');

const router = express.Router();

// All enrollment routes require authentication
router.use(authenticateUser);

// -----------------------------------------------------------------------
// Student routes
// -----------------------------------------------------------------------

// POST /api/enrollments
// Student enrolls in a course
router.post(
  '/',
  authorizeRoles('student'),
  enrollValidator,
  validateRequest,
  enrollmentController.enroll
);

// GET /api/enrollments/my-courses
// Student gets their enrolled courses
router.get(
  '/my-courses',
  authorizeRoles('student'),
  enrollmentController.getMyCourses
);

// GET /api/enrollments/check/:courseId
// Student checks if they're enrolled in a course
router.get(
  '/check/:courseId',
  authorizeRoles('student'),
  courseIdValidator,
  validateRequest,
  enrollmentController.checkEnrollment
);

// GET /api/enrollments/:id
// Get enrollment details (student can only see their own)
router.get(
  '/:id',
  enrollmentIdValidator,
  validateRequest,
  enrollmentController.getEnrollment
);

// PATCH /api/enrollments/:id/progress
// Update enrollment progress (student can only update their own)
router.patch(
  '/:id/progress',
  enrollmentIdValidator,
  progressValidator,
  validateRequest,
  enrollmentController.updateProgress
);

// -----------------------------------------------------------------------
// Admin routes
// -----------------------------------------------------------------------

// GET /api/enrollments/course/:courseId
// Admin: Get all students enrolled in a course
router.get(
  '/course/:courseId',
  authorizeRoles('admin'),
  courseIdValidator,
  paginationValidator,
  validateRequest,
  enrollmentController.getCourseEnrollments
);

// GET /api/enrollments/stats
// Admin: Get enrollment statistics
router.get(
  '/stats',
  authorizeRoles('admin'),
  enrollmentController.getEnrollmentStats
);

module.exports = router;
