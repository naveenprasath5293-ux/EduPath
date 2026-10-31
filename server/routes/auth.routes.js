const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticateUser = require('../middleware/authenticateUser');
const validateRequest = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidator,
  loginValidator,
  adminLoginValidator,
  updateProfileValidator,
} = require('../validators/auth.validator');

const router = express.Router();

// Public - student
router.post('/register', authLimiter, registerValidator, validateRequest, authController.register);
router.post('/login', authLimiter, loginValidator, validateRequest, authController.login);

// Public - admin
router.post('/admin/login', authLimiter, adminLoginValidator, validateRequest, authController.adminLogin);

// Public - logout just clears the cookie, no auth required to call it
router.post('/logout', authController.logout);

// Protected - either role
router.get('/profile', authenticateUser, authController.getProfile);
router.put('/profile', authenticateUser, updateProfileValidator, validateRequest, authController.updateProfile);

module.exports = router;
