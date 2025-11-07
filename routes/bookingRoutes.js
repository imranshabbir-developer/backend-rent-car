import express from 'express';
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public booking creation
router.post('/', createBooking);

// Admin protected routes
router.get('/', verifyToken, isAdmin, getBookings);
router.patch('/:id/status', verifyToken, isAdmin, updateBookingStatus);
router.delete('/:id', verifyToken, isAdmin, deleteBooking);

export default router;


