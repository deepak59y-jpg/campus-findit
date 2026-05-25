import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerRules, loginRules, validate } from '../middleware/validation.js';

const router = express.Router();

// Register a new user with validation
router.post('/register', registerRules, validate, registerUser);

// Login user with validation
router.post('/login', loginRules, validate, loginUser);

// Get current user context (requires JWT validation)
router.get('/me', protect, getMe);

export default router;
