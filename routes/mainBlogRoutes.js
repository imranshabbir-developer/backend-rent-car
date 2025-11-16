import express from 'express';
import {
  getAllMainBlogs,
  getMainBlogById,
  getMainBlogBySlug,
  createMainBlog,
  updateMainBlog,
  deleteMainBlog,
  toggleMainBlogPublish,
} from '../controllers/mainBlogController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { createUploadMiddleware, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Create multer instance for main blogs
const upload = createUploadMiddleware('main-blogs');

// Public routes
router.get('/', getAllMainBlogs);
router.get('/slug/:slug', getMainBlogBySlug);
router.get('/:id', getMainBlogById);

// Protected routes (Admin only)
router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.single('image'),
  handleUploadError,
  createMainBlog
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.single('image'),
  handleUploadError,
  updateMainBlog
);
router.delete('/:id', verifyToken, isAdmin, deleteMainBlog);
router.patch('/:id/publish', verifyToken, isAdmin, toggleMainBlogPublish);

export default router;

