import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from '../controllers/categoryController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { createUploadMiddleware, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Create multer instance for categories
const upload = createUploadMiddleware('categories');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (Admin only)
router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.single('photo'),
  handleUploadError,
  createCategory
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.single('photo'),
  handleUploadError,
  updateCategory
);

router.delete('/:id', verifyToken, isAdmin, deleteCategory);
router.patch('/:id/status', verifyToken, isAdmin, toggleCategoryStatus);

export default router;

