// routes/authRoutes.js - Authentication Routes with Email Verification
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
// router.get('/verify-email/:token', verifyEmail);
// router.post('/resend-verification', resendVerificationEmail);

// Private routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;