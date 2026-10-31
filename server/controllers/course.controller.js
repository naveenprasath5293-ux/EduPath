const courseService = require('../services/course.service');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

function buildThumbnailUrl(req) {
  if (!req.file) return null;
  return `/uploads/course-images/${req.file.filename}`;
}

function parseListQuery(req) {
  return {
    page: req.query.page ? parseInt(req.query.page, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    category: req.query.category,
    level: req.query.level,
  };
}

// ---------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------

const listPublicCourses = asyncHandler(async (req, res) => {
  const { page, limit, category, level } = parseListQuery(req);
  const result = await courseService.getPublicCourses({ page, limit: limit || 12, category, level });
  return new ApiResponse(200, 'Courses fetched', result).send(res);
});

const getPublicCourseBySlug = asyncHandler(async (req, res) => {
  const course = await courseService.getPublicCourseBySlug(req.params.slug);
  return new ApiResponse(200, 'Course fetched', { course }).send(res);
});

const searchCourses = asyncHandler(async (req, res) => {
  const { page, limit } = parseListQuery(req);
  const result = await courseService.searchPublicCourses({ q: req.query.q, page, limit: limit || 12 });
  return new ApiResponse(200, 'Search results', result).send(res);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await courseService.getPublicCategories();
  return new ApiResponse(200, 'Categories fetched', { categories }).send(res);
});

// ---------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------

const listAdminCourses = asyncHandler(async (req, res) => {
  const { page, limit, category, level } = parseListQuery(req);
  const result = await courseService.getAdminCourses({
    page,
    limit: limit || 20,
    category,
    level,
    status: req.query.status,
    search: req.query.search,
  });
  return new ApiResponse(200, 'Courses fetched', result).send(res);
});

const getAdminCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getAdminCourseById(req.params.id);
  return new ApiResponse(200, 'Course fetched', { course }).send(res);
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await courseService.getDashboardStats();
  return new ApiResponse(200, 'Stats fetched', stats).send(res);
});

const createCourse = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Course thumbnail is required');
  }
  const thumbnailUrl = buildThumbnailUrl(req);
  const course = await courseService.createCourse(req.body, thumbnailUrl, req.user._id);
  return new ApiResponse(201, 'Course created successfully', { course }).send(res);
});

const updateCourse = asyncHandler(async (req, res) => {
  const thumbnailUrl = buildThumbnailUrl(req);
  const course = await courseService.updateCourse(req.params.id, req.body, thumbnailUrl, req.user._id);
  return new ApiResponse(200, 'Course updated successfully', { course }).send(res);
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.softDeleteCourse(req.params.id);
  return new ApiResponse(200, 'Course deleted successfully').send(res);
});

const restoreCourse = asyncHandler(async (req, res) => {
  const course = await courseService.restoreCourse(req.params.id);
  return new ApiResponse(200, 'Course restored successfully', { course }).send(res);
});

const updateCourseStatus = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourseStatus(req.params.id, req.body.status, req.user._id);
  return new ApiResponse(200, 'Course status updated', { course }).send(res);
});

module.exports = {
  listPublicCourses,
  getPublicCourseBySlug,
  searchCourses,
  getCategories,
  listAdminCourses,
  getAdminCourseById,
  getDashboardStats,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
  updateCourseStatus,
};
