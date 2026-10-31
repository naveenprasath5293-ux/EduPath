const { body, param } = require('express-validator');

const createLessonValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Lesson title is required')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or fewer'),

  body('lessonNumber')
    .notEmpty().withMessage('Lesson number is required')
    .isInt({ min: 1 }).withMessage('Lesson number must be a positive integer')
    .toInt(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long'),

  body('content')
    .optional()
    .trim(),

  body('videoUrl')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      // Allow YouTube URLs only
      const ytPattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
      if (!ytPattern.test(value)) {
        throw new Error('Only YouTube URLs are supported (e.g. https://youtube.com/watch?v=...)');
      }
      return true;
    }),

  body('duration')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Duration too long'),

  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be true or false')
    .toBoolean(),
];

const updateLessonValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title too long'),

  body('lessonNumber')
    .optional()
    .isInt({ min: 1 }).withMessage('Lesson number must be a positive integer')
    .toInt(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long'),

  body('content')
    .optional()
    .trim(),

  body('videoUrl')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      const ytPattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
      if (!ytPattern.test(value)) {
        throw new Error('Only YouTube URLs are supported');
      }
      return true;
    }),

  body('duration')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Duration too long'),

  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be true or false')
    .toBoolean(),
];

module.exports = { createLessonValidator, updateLessonValidator };
