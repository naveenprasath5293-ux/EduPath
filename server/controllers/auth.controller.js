const authService = require('../services/auth.service');
const { ROLES } = require('../models/User.model');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  maxAge: env.cookie.maxAgeMs,
  path: '/',
};

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerStudent(req.body);
  res.cookie(env.cookie.name, token, cookieOptions);
  return new ApiResponse(201, 'Registration successful', { user }).send(res);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password, ROLES.STUDENT);
  res.cookie(env.cookie.name, token, cookieOptions);
  return new ApiResponse(200, 'Login successful', { user }).send(res);
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password, ROLES.ADMIN);
  res.cookie(env.cookie.name, token, cookieOptions);
  return new ApiResponse(200, 'Admin login successful', { user }).send(res);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookie.name, { path: '/' });
  return new ApiResponse(200, 'Logged out successfully').send(res);
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  return new ApiResponse(200, 'Profile fetched', { user }).send(res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  return new ApiResponse(200, 'Profile updated', { user }).send(res);
});

module.exports = {
  register,
  login,
  adminLogin,
  logout,
  getProfile,
  updateProfile,
};
