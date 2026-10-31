const { body } = require('express-validator');

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PHONE_REGEX = /^[+]?[0-9]{10,15}$/;

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),

  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required')
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character'),

  body('confirmPassword').notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  body('phone').trim().notEmpty().withMessage('Phone number is required')
    .matches(PHONE_REGEX).withMessage('Enter a valid phone number (10-15 digits)'),
];

const loginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

const adminLoginValidator = loginValidator;

const updateProfileValidator = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phone').optional().trim().matches(PHONE_REGEX).withMessage('Enter a valid phone number (10-15 digits)'),
  body('profileImage').optional({ checkFalsy: true }).isURL().withMessage('Profile image must be a valid URL'),
];

module.exports = {
  registerValidator,
  loginValidator,
  adminLoginValidator,
  updateProfileValidator,
};
