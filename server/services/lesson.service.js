const { Lesson } = require('../models/Lesson.model');
const { Course, COURSE_STATUS } = require('../models/Course.model');
const { Enrollment, ENROLLMENT_STATUS } = require('../models/Enrollment.model');
const ApiError = require('../utils/ApiError');

/**
 * Convert a YouTube watch URL to embed URL.
 * e.g. https://youtube.com/watch?v=ABC123 → https://www.youtube.com/embed/ABC123
 */
function toEmbedUrl(url) {
  if (!url) return '';
  try {
    // youtu.be shortlink
    const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // Standard watch URL
    const watchMatch = url.match(/[?&]v=([\w-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  } catch (_) {
    // fall through
  }
  return url;
}

// ── ADMIN OPERATIONS ────────────────────────────────────────────────────────

/**
 * Get all lessons for a course (admin — all lessons regardless of publish state).
 */
async function getLessonsForAdmin(courseId) {
  const course = await Course.findById(courseId);
  if (!course || course.isDeleted) throw ApiError.notFound('Course not found');

  const lessons = await Lesson.find({ course: courseId })
    .sort({ lessonNumber: 1 })
    .lean();

  return lessons.map((l) => ({ ...l, embedUrl: toEmbedUrl(l.videoUrl) }));
}

/**
 * Create a new lesson in a course.
 */
async function createLesson(courseId, adminId, payload) {
  const course = await Course.findById(courseId);
  if (!course || course.isDeleted) throw ApiError.notFound('Course not found');

  // Check for duplicate lesson number within same course
  const existing = await Lesson.findOne({ course: courseId, lessonNumber: payload.lessonNumber });
  if (existing) {
    throw ApiError.conflict(`Lesson number ${payload.lessonNumber} already exists in this course`);
  }

  const lesson = await Lesson.create({
    course: courseId,
    title: payload.title,
    description: payload.description || '',
    content: payload.content || '',
    lessonNumber: payload.lessonNumber,
    videoUrl: payload.videoUrl || '',
    duration: payload.duration || '',
    isPublished: payload.isPublished || false,
    createdBy: adminId,
  });

  return { ...lesson.toObject(), embedUrl: toEmbedUrl(lesson.videoUrl) };
}

/**
 * Update an existing lesson.
 */
async function updateLesson(courseId, lessonId, payload) {
  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
  if (!lesson) throw ApiError.notFound('Lesson not found');

  // Check for duplicate lesson number (different lesson, same number)
  if (payload.lessonNumber && payload.lessonNumber !== lesson.lessonNumber) {
    const conflict = await Lesson.findOne({
      course: courseId,
      lessonNumber: payload.lessonNumber,
      _id: { $ne: lessonId },
    });
    if (conflict) throw ApiError.conflict(`Lesson number ${payload.lessonNumber} is already taken`);
  }

  const allowed = ['title', 'description', 'content', 'lessonNumber', 'videoUrl', 'duration', 'isPublished'];
  allowed.forEach((key) => {
    if (payload[key] !== undefined) lesson[key] = payload[key];
  });

  await lesson.save();
  return { ...lesson.toObject(), embedUrl: toEmbedUrl(lesson.videoUrl) };
}

/**
 * Delete a lesson permanently.
 */
async function deleteLesson(courseId, lessonId) {
  const lesson = await Lesson.findOneAndDelete({ _id: lessonId, course: courseId });
  if (!lesson) throw ApiError.notFound('Lesson not found');
  return { deleted: true };
}

/**
 * Toggle lesson publish state.
 */
async function toggleLessonPublish(courseId, lessonId) {
  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
  if (!lesson) throw ApiError.notFound('Lesson not found');
  lesson.isPublished = !lesson.isPublished;
  await lesson.save();
  return { ...lesson.toObject(), embedUrl: toEmbedUrl(lesson.videoUrl) };
}

// ── STUDENT OPERATIONS ───────────────────────────────────────────────────────

/**
 * Get published lessons for a course the student is enrolled in.
 * Attaches completion state from the student's enrollment record.
 */
async function getLessonsForStudent(courseId, studentId) {
  // Validate course exists and is published
  const course = await Course.findOne({
    _id: courseId,
    status: COURSE_STATUS.PUBLISHED,
    isDeleted: false,
  });
  if (!course) throw ApiError.notFound('Course not found');

  // Validate student has active enrollment
  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: studentId,
  });
  if (!enrollment) throw ApiError.forbidden('You are not enrolled in this course');

  const lessons = await Lesson.find({ course: courseId, isPublished: true })
    .sort({ lessonNumber: 1 })
    .lean();

  const completedSet = new Set(
    (enrollment.completedLessons || []).map((id) => id.toString())
  );

  return {
    course: {
      _id: course._id,
      title: course.title,
      slug: course.slug,
    },
    lessons: lessons.map((l) => ({
      ...l,
      embedUrl: toEmbedUrl(l.videoUrl),
      isCompleted: completedSet.has(l._id.toString()),
    })),
    enrollment: {
      _id: enrollment._id,
      progress: enrollment.progress,
      status: enrollment.status,
      completedLessons: enrollment.completedLessons,
    },
  };
}

/**
 * Mark a lesson as complete for a student.
 * Recalculates and saves real progress. Marks enrollment complete when 100%.
 */
async function completeLesson(courseId, lessonId, studentId) {
  // Verify course + lesson exist and are published
  const course = await Course.findOne({
    _id: courseId,
    status: COURSE_STATUS.PUBLISHED,
    isDeleted: false,
  });
  if (!course) throw ApiError.notFound('Course not found');

  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId, isPublished: true });
  if (!lesson) throw ApiError.notFound('Lesson not found or not published');

  // Find enrollment — always use studentId from req.user
  const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
  if (!enrollment) throw ApiError.forbidden('You are not enrolled in this course');

  // Prevent duplicate completion entries
  const alreadyDone = enrollment.completedLessons.some((id) => id.toString() === lessonId.toString());
  if (!alreadyDone) {
    enrollment.completedLessons.push(lessonId);
  }

  // Recalculate progress from real data
  const totalLessons = await Lesson.countDocuments({ course: courseId, isPublished: true });
  const completedCount = enrollment.completedLessons.length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  enrollment.progress = Math.min(progress, 100);

  if (enrollment.progress >= 100 && enrollment.status !== ENROLLMENT_STATUS.COMPLETED) {
    enrollment.status = ENROLLMENT_STATUS.COMPLETED;
    enrollment.completedAt = new Date();
  }

  await enrollment.save();

  return {
    lessonId,
    progress: enrollment.progress,
    status: enrollment.status,
    completedLessons: enrollment.completedLessons,
    courseCompleted: enrollment.status === ENROLLMENT_STATUS.COMPLETED,
  };
}

module.exports = {
  getLessonsForAdmin,
  createLesson,
  updateLesson,
  deleteLesson,
  toggleLessonPublish,
  getLessonsForStudent,
  completeLesson,
  toEmbedUrl,
};
