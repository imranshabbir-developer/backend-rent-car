import express from 'express';
import {
  createContactQuery,
  deleteContactQuery,
  getContactQueryById,
  getContactQueries,
  updateContactQuery,
} from '../controllers/contactQueryController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public contact query creation
router.post('/', createContactQuery);

// Admin protected routes
router.get('/', verifyToken, isAdmin, getContactQueries);
router.get('/:id', verifyToken, isAdmin, getContactQueryById);
router.put('/:id', verifyToken, isAdmin, updateContactQuery);
router.delete('/:id', verifyToken, isAdmin, deleteContactQuery);

export default router;

