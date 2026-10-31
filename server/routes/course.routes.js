const express = require('express');
const courseController = require('../controllers/course.controller');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const uploadCourseImage = require('../middleware/uploadCourseImage');
const {
  createCourseValidator,
  updateCourseValidator,
  updateStatusValidator,
  listCoursesValidator,
} = require('../validators/course.validator');

// -----------------------------------------------------------------------
// Public router - mounted at /api/courses
// -----------------------------------------------------------------------
const publicCourseRouter = express.Router();

publicCourseRouter.get('/search', listCoursesValidator, validateRequest, courseController.searchCourses);
publicCourseRouter.get('/categories', courseController.getCategories);
publicCourseRouter.get('/:slug', courseController.getPublicCourseBySlug);
publicCourseRouter.get('/', listCoursesValidator, validateRequest, courseController.listPublicCourses);

// -----------------------------------------------------------------------
// Admin router - mounted at /api/admin/courses, every route requires an
// authenticated admin.
// -----------------------------------------------------------------------
const adminCourseRouter = express.Router();
adminCourseRouter.use(authenticateUser, authorizeRoles('admin'));

adminCourseRouter.get('/stats', courseController.getDashboardStats);
adminCourseRouter.get('/:id', courseController.getAdminCourseById);
adminCourseRouter.get('/', listCoursesValidator, validateRequest, courseController.listAdminCourses);

adminCourseRouter.post(
  '/',
  uploadCourseImage.single('thumbnail'),
  createCourseValidator,
  validateRequest,
  courseController.createCourse
);

adminCourseRouter.put(
  '/:id',
  uploadCourseImage.single('thumbnail'),
  updateCourseValidator,
  validateRequest,
  courseController.updateCourse
);

adminCourseRouter.delete('/:id', courseController.deleteCourse);
adminCourseRouter.patch('/:id/restore', courseController.restoreCourse);
adminCourseRouter.patch('/:id/status', updateStatusValidator, validateRequest, courseController.updateCourseStatus);

module.exports = { publicCourseRouter, adminCourseRouter };
