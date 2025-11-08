import express from 'express';
import {
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestions,
  updateQuestionStatus,
} from '../controllers/questionController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public question creation
router.post('/', createQuestion);

// Admin protected routes
router.get('/', verifyToken, isAdmin, getQuestions);
router.get('/:id', verifyToken, isAdmin, getQuestionById);
router.patch('/:id', verifyToken, isAdmin, updateQuestionStatus);
router.delete('/:id', verifyToken, isAdmin, deleteQuestion);

export default router;

