const express = require('express');
const authRoutes = require('./auth.routes');
const { publicCourseRouter, adminCourseRouter } = require('./course.routes');
const enrollmentRoutes = require('./enrollment.routes');
const { adminLessonRouter, studentLessonRouter } = require('./lesson.routes');

const router = express.Router();

router.use('/auth', authRoutes);

// Course routes
router.use('/courses', publicCourseRouter);
router.use('/admin/courses', adminCourseRouter);

// Lesson routes — nested under courses
router.use('/courses/:courseId/lessons', studentLessonRouter);
router.use('/admin/courses/:courseId/lessons', adminLessonRouter);

// Enrollment routes
router.use('/enrollments', enrollmentRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

module.exports = router;
