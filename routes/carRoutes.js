import express from 'express';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  toggleCarAvailability,
  updateCarStatus,
} from '../controllers/carController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { createUploadMiddleware, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Create multer instance for cars
const upload = createUploadMiddleware('cars');

// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarById);

// Protected routes (Admin only)
router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.array('carPhotos', 10), // Allow up to 10 images
  handleUploadError,
  createCar
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.array('carPhotos', 10), // Allow up to 10 images
  handleUploadError,
  updateCar
);

router.delete('/:id', verifyToken, isAdmin, deleteCar);
router.patch('/:id/availability', verifyToken, isAdmin, toggleCarAvailability);
router.patch('/:id/status', verifyToken, isAdmin, updateCarStatus);

export default router;

