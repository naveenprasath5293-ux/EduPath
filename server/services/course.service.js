const fs = require('fs');
const path = require('path');
const { Course, COURSE_STATUS } = require('../models/Course.model');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');
const escapeRegex = require('../utils/escapeRegex');
const { parseStringArray } = require('../validators/course.validator');

const PUBLIC_FILTER = { status: COURSE_STATUS.PUBLISHED, isDeleted: false };

/**
 * Generates a unique slug from a title, appending -2, -3, ... on
 * collision. `excludeId` lets an update keep its own slug when the
 * title hasn't changed.
 */
async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    // eslint-disable-next-line no-await-in-loop
    const existing = await Course.findOne(query);
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

function toAbsoluteThumbnailPath(thumbnailUrl) {
  if (!thumbnailUrl) return null;
  const filename = path.basename(thumbnailUrl);
  return path.join(__dirname, '..', 'uploads', 'course-images', filename);
}

/** Best-effort cleanup - a failed unlink should never break the request. */
function deleteThumbnailFile(thumbnailUrl) {
  const absolutePath = toAbsoluteThumbnailPath(thumbnailUrl);
  if (!absolutePath) return;
  fs.unlink(absolutePath, () => {});
}

async function createCourse(data, thumbnailUrl, adminId) {
  const duplicate = await Course.findOne({
    title: new RegExp(`^${escapeRegex(data.title.trim())}$`, 'i'),
    isDeleted: false,
  });
  if (duplicate) {
    throw ApiError.conflict('A course with this title already exists');
  }

  const slug = await generateUniqueSlug(data.title);

  const course = await Course.create({
    title: data.title,
    slug,
    description: data.description,
    shortDescription: data.shortDescription || '',
    category: data.category,
    level: data.level,
    duration: data.duration,
    price: data.price,
    thumbnail: thumbnailUrl,
    instructor: data.instructor,
    requirements: parseStringArray(data.requirements),
    benefits: parseStringArray(data.benefits),
    createdBy: adminId,
    updatedBy: adminId,
  });

  return course;
}

async function updateCourse(courseId, data, thumbnailUrl, adminId) {
  const course = await Course.findOne({ _id: courseId, isDeleted: false });
  if (!course) throw ApiError.notFound('Course not found');

  if (data.title && data.title.trim() !== course.title) {
    const duplicate = await Course.findOne({
      _id: { $ne: courseId },
      title: new RegExp(`^${escapeRegex(data.title.trim())}$`, 'i'),
      isDeleted: false,
    });
    if (duplicate) throw ApiError.conflict('A course with this title already exists');
    course.slug = await generateUniqueSlug(data.title, courseId);
    course.title = data.title;
  }

  const directFields = ['description', 'shortDescription', 'category', 'level', 'duration', 'instructor'];
  directFields.forEach((field) => {
    if (data[field] !== undefined) course[field] = data[field];
  });

  if (data.price !== undefined) course.price = data.price;
  if (data.requirements !== undefined) course.requirements = parseStringArray(data.requirements);
  if (data.benefits !== undefined) course.benefits = parseStringArray(data.benefits);

  if (thumbnailUrl) {
    const oldThumbnail = course.thumbnail;
    course.thumbnail = thumbnailUrl;
    if (oldThumbnail) deleteThumbnailFile(oldThumbnail);
  }

  course.updatedBy = adminId;
  await course.save();
  return course;
}

async function softDeleteCourse(courseId) {
  const course = await Course.findOne({ _id: courseId, isDeleted: false });
  if (!course) throw ApiError.notFound('Course not found');
  course.isDeleted = true;
  await course.save();
  return course;
}

async function restoreCourse(courseId) {
  const course = await Course.findOne({ _id: courseId, isDeleted: true });
  if (!course) throw ApiError.notFound('Deleted course not found');
  course.isDeleted = false;
  await course.save();
  return course;
}

async function updateCourseStatus(courseId, status, adminId) {
  const course = await Course.findOne({ _id: courseId, isDeleted: false });
  if (!course) throw ApiError.notFound('Course not found');
  course.status = status;
  course.updatedBy = adminId;
  await course.save();
  return course;
}

function buildPagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
}

/** Public catalog - published, non-deleted courses only. */
async function getPublicCourses({ page = 1, limit = 12, category, level, sort = '-createdAt' }) {
  const filter = { ...PUBLIC_FILTER };
  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
  if (level) filter.level = level;

  const skip = (page - 1) * limit;
  const [courses, total] = await Promise.all([
    Course.find(filter).sort(sort).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ]);

  return { courses, pagination: buildPagination(page, limit, total) };
}

async function getPublicCourseBySlug(slug) {
  const course = await Course.findOne({ slug, ...PUBLIC_FILTER });
  if (!course) throw ApiError.notFound('Course not found');
  return course;
}

async function searchPublicCourses({ q, page = 1, limit = 12 }) {
  if (!q || !q.trim()) return { courses: [], pagination: buildPagination(page, limit, 0) };

  const filter = { ...PUBLIC_FILTER, $text: { $search: q.trim() } };
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit),
    Course.countDocuments(filter),
  ]);

  return { courses, pagination: buildPagination(page, limit, total) };
}

async function getPublicCategories() {
  return Course.distinct('category', PUBLIC_FILTER);
}

/** Admin catalog - everything, including drafts and soft-deleted courses. */
async function getAdminCourses({ page = 1, limit = 20, status, category, level, search }) {
  const filter = {};

  // 'deleted' is a pseudo-status the frontend uses for its "Deleted" tab -
  // it maps to isDeleted:true and must never be assigned to the status
  // enum field (which only accepts 'draft'/'published').
  if (status === 'deleted') {
    filter.isDeleted = true;
  } else {
    filter.isDeleted = false;
    if (status) filter.status = status;
  }

  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
  if (level) filter.level = level;
  if (search) filter.title = new RegExp(escapeRegex(search.trim()), 'i');

  const skip = (page - 1) * limit;
  const [courses, total] = await Promise.all([
    Course.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Course.countDocuments(filter),
  ]);

  return { courses, pagination: buildPagination(page, limit, total) };
}

async function getAdminCourseById(courseId) {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound('Course not found');
  return course;
}

async function getDashboardStats() {
  const [total, published, draft, deleted] = await Promise.all([
    Course.countDocuments({ isDeleted: false }),
    Course.countDocuments({ status: COURSE_STATUS.PUBLISHED, isDeleted: false }),
    Course.countDocuments({ status: COURSE_STATUS.DRAFT, isDeleted: false }),
    Course.countDocuments({ isDeleted: true }),
  ]);

  const recentCourses = await Course.find({ isDeleted: false }).sort('-createdAt').limit(5);

  return { total, published, draft, deleted, recentCourses };
}

module.exports = {
  createCourse,
  updateCourse,
  softDeleteCourse,
  restoreCourse,
  updateCourseStatus,
  getPublicCourses,
  getPublicCourseBySlug,
  searchPublicCourses,
  getPublicCategories,
  getAdminCourses,
  getAdminCourseById,
  getDashboardStats,
};
