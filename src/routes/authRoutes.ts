// Auth route definitions - connects routes to controller
import express from 'express';
import { signup, login, refresh, me } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
//todo: add logout route

// Protected routes (authentication required)
router.get('/me', authenticateToken, me);

export default router;
