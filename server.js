import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/dbConfig.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import carRoutes from './routes/carRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cars', carRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bgMagenta);
});

