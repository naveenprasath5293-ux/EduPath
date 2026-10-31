const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Validate enrollment creation
 */
const enrollValidator = [
  body('courseId')
    .trim()
    .notEmpty()
    .withMessage('Course ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid course ID');
      }
      return true;
    }),
];

/**
 * Validate enrollment ID parameter
 */
const enrollmentIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Enrollment ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid enrollment ID');
      }
      return true;
    }),
];

/**
 * Validate course ID parameter
 */
const courseIdValidator = [
  param('courseId')
    .trim()
    .notEmpty()
    .withMessage('Course ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid course ID');
      }
      return true;
    }),
];

/**
 * Validate progress update
 */
const progressValidator = [
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
];

/**
 * Validate pagination parameters
 */
const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  enrollValidator,
  enrollmentIdValidator,
  courseIdValidator,
  progressValidator,
  paginationValidator,
};
