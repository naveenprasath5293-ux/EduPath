const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const lessonService = require('../services/lesson.service');

// ── ADMIN ────────────────────────────────────────────────────────────────────

const getAdminLessons = asyncHandler(async (req, res) => {
  const lessons = await lessonService.getLessonsForAdmin(req.params.courseId);
  new ApiResponse(200, 'Lessons fetched', { lessons }).send(res);
});

const createLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.createLesson(
    req.params.courseId,
    req.user._id,
    req.body
  );
  new ApiResponse(201, 'Lesson created', { lesson }).send(res);
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.updateLesson(
    req.params.courseId,
    req.params.lessonId,
    req.body
  );
  new ApiResponse(200, 'Lesson updated', { lesson }).send(res);
});

const deleteLesson = asyncHandler(async (req, res) => {
  await lessonService.deleteLesson(req.params.courseId, req.params.lessonId);
  new ApiResponse(200, 'Lesson deleted', null).send(res);
});

const togglePublish = asyncHandler(async (req, res) => {
  const lesson = await lessonService.toggleLessonPublish(
    req.params.courseId,
    req.params.lessonId
  );
  new ApiResponse(200, `Lesson ${lesson.isPublished ? 'published' : 'unpublished'}`, { lesson }).send(res);
});

// ── STUDENT ──────────────────────────────────────────────────────────────────

const getStudentLessons = asyncHandler(async (req, res) => {
  const data = await lessonService.getLessonsForStudent(
    req.params.courseId,
    req.user._id   // NEVER use req.body.studentId
  );
  new ApiResponse(200, 'Lessons fetched', data).send(res);
});

const completeLesson = asyncHandler(async (req, res) => {
  const result = await lessonService.completeLesson(
    req.params.courseId,
    req.params.lessonId,
    req.user._id   // NEVER trust req.body.studentId
  );
  new ApiResponse(200, 'Lesson marked complete', result).send(res);
});

module.exports = {
  getAdminLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  togglePublish,
  getStudentLessons,
  completeLesson,
};
