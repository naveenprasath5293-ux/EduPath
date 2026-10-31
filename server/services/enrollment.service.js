const { Enrollment, ENROLLMENT_STATUS } = require('../models/Enrollment.model');
const { Course, COURSE_STATUS } = require('../models/Course.model');
const ApiError = require('../utils/ApiError');

/**
 * Enrolls a student in a published course.
 *
 * @param {ObjectId} studentId - From authenticated req.user (never from request body)
 * @param {ObjectId} courseId - Course to enroll in
 * @returns {Promise<Object>} Created enrollment
 * @throws {ApiError} if course doesn't exist, is deleted, unpublished, or duplicate enrollment
 */
async function enrollStudent(studentId, courseId) {
  // Verify course exists and is available
  const course = await Course.findOne({
    _id: courseId,
    status: COURSE_STATUS.PUBLISHED,
    isDeleted: false,
  });

  if (!course) {
    throw ApiError.notFound('Course is not available for enrollment');
  }

  // Check for duplicate enrollment
  const existing = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existing) {
    throw ApiError.conflict('You are already enrolled in this course');
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    status: ENROLLMENT_STATUS.ENROLLED,
    progress: 0,
    enrolledAt: new Date(),
  });

  // Increment course enrolledCount
  await Course.findByIdAndUpdate(
    courseId,
    { $inc: { enrolledCount: 1 } },
    { new: true }
  );

  // Populate student and course details
  const result = await enrollment.populate([
    { path: 'student', select: 'fullName email' },
    { path: 'course', select: 'title thumbnail category' },
  ]);

  return result;
}

/**
 * Gets all courses a student is enrolled in.
 *
 * @param {ObjectId} studentId - Student ID
 * @returns {Promise<Array>} Array of enrollments with populated course data
 */
async function getMyCourses(studentId) {
  const enrollments = await Enrollment.find({
    student: studentId,
    status: { $in: [ENROLLMENT_STATUS.ENROLLED, ENROLLMENT_STATUS.COMPLETED] },
  })
    .populate({
      path: 'course',
      select: 'title thumbnail shortDescription category level duration instructor slug',
    })
    .sort({ enrolledAt: -1 });

  return enrollments;
}

/**
 * Checks if a student is enrolled in a course.
 *
 * @param {ObjectId} studentId - Student ID
 * @param {ObjectId} courseId - Course ID
 * @returns {Promise<Object|null>} Enrollment record if exists, null otherwise
 */
async function checkEnrollment(studentId, courseId) {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  return enrollment || null;
}

/**
 * Gets an enrollment by ID with authorization check.
 *
 * @param {ObjectId} enrollmentId - Enrollment ID
 * @param {Object} user - Authenticated user (for authorization)
 * @returns {Promise<Object>} Enrollment with populated data
 * @throws {ApiError} if not found or unauthorized
 */
async function getEnrollmentById(enrollmentId, user) {
  const enrollment = await Enrollment.findById(enrollmentId).populate([
    { path: 'student', select: 'fullName email' },
    { path: 'course', select: 'title thumbnail shortDescription' },
  ]);

  if (!enrollment) {
    throw ApiError.notFound('Enrollment not found');
  }

  // Authorization: student can only see their own enrollments
  if (user.role === 'student' && enrollment.student._id.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You do not have access to this enrollment');
  }

  return enrollment;
}

/**
 * Updates progress and status of an enrollment.
 * When progress reaches 100, marks as completed.
 *
 * @param {ObjectId} enrollmentId - Enrollment ID
 * @param {Number} progress - Progress value 0-100
 * @param {Object} user - Authenticated user (for authorization)
 * @returns {Promise<Object>} Updated enrollment
 * @throws {ApiError} if not found, unauthorized, or invalid progress
 */
async function updateProgress(enrollmentId, progress, user) {
  if (progress < 0 || progress > 100) {
    throw ApiError.badRequest('Progress must be between 0 and 100');
  }

  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw ApiError.notFound('Enrollment not found');
  }

  // Authorization: student can only update their own enrollment
  if (user.role === 'student' && enrollment.student.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You do not have access to this enrollment');
  }

  // Update progress and status
  const newStatus = progress === 100 ? ENROLLMENT_STATUS.COMPLETED : ENROLLMENT_STATUS.ENROLLED;
  const updateData = {
    progress,
    status: newStatus,
  };

  if (progress === 100 && !enrollment.completedAt) {
    updateData.completedAt = new Date();
  }

  const updated = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    updateData,
    { new: true }
  ).populate([
    { path: 'student', select: 'fullName email' },
    { path: 'course', select: 'title' },
  ]);

  return updated;
}

/**
 * Gets all students enrolled in a specific course (admin only).
 *
 * @param {ObjectId} courseId - Course ID
 * @param {Object} options - Query options (page, limit)
 * @returns {Promise<Object>} Enrollments with pagination data
 */
async function getCourseEnrollments(courseId, options = {}) {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Verify course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw ApiError.notFound('Course not found');
  }

  const enrollments = await Enrollment.find({ course: courseId })
    .populate({
      path: 'student',
      select: 'fullName email phone',
    })
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Enrollment.countDocuments({ course: courseId });

  return {
    enrollments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Gets enrollment statistics for the admin dashboard.
 *
 * @returns {Promise<Object>} Enrollment stats
 */
async function getEnrollmentStats() {
  const totalEnrollments = await Enrollment.countDocuments();

  const completedEnrollments = await Enrollment.countDocuments({
    status: ENROLLMENT_STATUS.COMPLETED,
  });

  const activeEnrollments = await Enrollment.countDocuments({
    status: ENROLLMENT_STATUS.ENROLLED,
  });

  const cancelledEnrollments = await Enrollment.countDocuments({
    status: ENROLLMENT_STATUS.CANCELLED,
  });

  const totalStudents = await Enrollment.distinct('student').then((ids) => ids.length);

  // Most enrolled course
  const mostEnrolled = await Enrollment.aggregate([
    {
      $group: {
        _id: '$course',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'courseData',
      },
    },
  ]);

  return {
    totalEnrollments,
    completedEnrollments,
    activeEnrollments,
    cancelledEnrollments,
    totalStudents,
    mostEnrolledCourse: mostEnrolled.length > 0 ? {
      courseId: mostEnrolled[0]._id,
      courseTitle: mostEnrolled[0].courseData[0]?.title,
      enrollmentCount: mostEnrolled[0].count,
    } : null,
  };
}

module.exports = {
  enrollStudent,
  getMyCourses,
  checkEnrollment,
  getEnrollmentById,
  updateProgress,
  getCourseEnrollments,
  getEnrollmentStats,
};
