const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const {
  createLessonValidator,
  updateLessonValidator,
} = require('../validators/lesson.validator');
const {
  getAdminLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  togglePublish,
  getStudentLessons,
  completeLesson,
} = require('../controllers/lesson.controller');

// ── Admin lesson router — mounted at /api/admin/courses/:courseId/lessons ──
const adminLessonRouter = express.Router({ mergeParams: true });

adminLessonRouter.use(authenticateUser, authorizeRoles('admin'));

adminLessonRouter
  .route('/')
  .get(getAdminLessons)
  .post(createLessonValidator, validateRequest, createLesson);

adminLessonRouter
  .route('/:lessonId')
  .patch(updateLessonValidator, validateRequest, updateLesson)
  .delete(deleteLesson);

adminLessonRouter
  .route('/:lessonId/toggle-publish')
  .patch(togglePublish);

// ── Student lesson router — mounted at /api/courses/:courseId/lessons ──
const studentLessonRouter = express.Router({ mergeParams: true });

studentLessonRouter.use(authenticateUser, authorizeRoles('student'));

studentLessonRouter
  .route('/')
  .get(getStudentLessons);

studentLessonRouter
  .route('/:lessonId/complete')
  .post(completeLesson);

module.exports = { adminLessonRouter, studentLessonRouter };
