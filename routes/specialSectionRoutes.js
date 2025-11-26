import express from 'express';
import {
  getAllSpecialSections,
  getSpecialSectionById,
  getSpecialSectionBySlug,
  createSpecialSection,
  updateSpecialSection,
  deleteSpecialSection,
  toggleSpecialSectionStatus,
} from '../controllers/specialSectionController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllSpecialSections);
router.get('/slug/:slug', getSpecialSectionBySlug);
router.get('/:id', getSpecialSectionById);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, createSpecialSection);
router.put('/:id', verifyToken, isAdmin, updateSpecialSection);
router.delete('/:id', verifyToken, isAdmin, deleteSpecialSection);
router.patch('/:id/toggle', verifyToken, isAdmin, toggleSpecialSectionStatus);

export default router;

