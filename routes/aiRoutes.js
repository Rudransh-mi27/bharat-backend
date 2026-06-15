import express from 'express';
import * as aiController from '../controllers/aiController.js';
import * as authController from '../controllers/authController.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All AI routes require authentication
router.use(authController.protect);

// Prompt query (rate-limited)
router.post('/ask', aiLimiter, aiController.askStudyBuddy);

// History and dashboard operations
router.route('/history')
  .get(aiController.getMyChatHistory)
  .delete(aiController.deleteChatHistory);

router.get('/metrics', aiController.getAIMetrics);

// Admin-specific endpoints
router.use(authController.restrictTo('admin'));

router.get('/admin/chats', aiController.getAllChatsAdmin);
router.delete('/admin/chats/:id', aiController.deleteChatAdmin);

export default router;
