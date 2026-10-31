const { body, query } = require('express-validator');
const { COURSE_LEVELS, COURSE_STATUS } = require('../models/Course.model');

/**
 * requirements/benefits arrive from multipart form-data as a
 * JSON-stringified array (FormData can't send real arrays cleanly
 * alongside a file), so we parse-and-validate them here rather than
 * relying on express-validator's array helpers.
 */
function parseStringArray(value) {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return parsed.map(String).map((s) => s.trim()).filter(Boolean);
  } catch (err) {
    throw new Error('Must be a JSON array of strings');
  }
}

const createCourseValidator = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title is too long'),

  body('category').trim().notEmpty().withMessage('Category is required'),

  body('level').notEmpty().withMessage('Level is required')
    .isIn(Object.values(COURSE_LEVELS)).withMessage('Select a valid level'),

  body('duration').trim().notEmpty().withMessage('Duration is required'),

  body('price').notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('instructor').trim().notEmpty().withMessage('Instructor is required'),

  body('description').trim().notEmpty().withMessage('Description is required'),

  body('shortDescription').optional().trim().isLength({ max: 200 }).withMessage('Short description is too long'),

  body('requirements').optional().custom((value) => {
    parseStringArray(value);
    return true;
  }).withMessage('Requirements must be a JSON array of strings'),

  body('benefits').optional().custom((value) => {
    parseStringArray(value);
    return true;
  }).withMessage('Benefits must be a JSON array of strings'),

  // Thumbnail itself is validated in the controller (req.file), since
  // express-validator only sees text fields from multipart bodies.
];

const updateCourseValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title is too long'),

  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),

  body('level').optional().isIn(Object.values(COURSE_LEVELS)).withMessage('Select a valid level'),

  body('duration').optional().trim().notEmpty().withMessage('Duration cannot be empty'),

  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('instructor').optional().trim().notEmpty().withMessage('Instructor cannot be empty'),

  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),

  body('shortDescription').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('Short description is too long'),

  body('requirements').optional().custom((value) => {
    parseStringArray(value);
    return true;
  }).withMessage('Requirements must be a JSON array of strings'),

  body('benefits').optional().custom((value) => {
    parseStringArray(value);
    return true;
  }).withMessage('Benefits must be a JSON array of strings'),
];

const updateStatusValidator = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(Object.values(COURSE_STATUS)).withMessage('Status must be draft or published'),
];

const listCoursesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  updateStatusValidator,
  listCoursesValidator,
  parseStringArray,
};
