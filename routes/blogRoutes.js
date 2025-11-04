import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
} from '../controllers/blogController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, createBlog);
router.put('/:id', verifyToken, isAdmin, updateBlog);
router.delete('/:id', verifyToken, isAdmin, deleteBlog);
router.patch('/:id/publish', verifyToken, isAdmin, toggleBlogPublish);

export default router;

