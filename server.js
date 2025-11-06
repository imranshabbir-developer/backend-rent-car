import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/dbConfig.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import carRoutes from './routes/carRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...'.red);
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION!'.red);
  console.error(err.name, err.message);
});

// Initialize Express app
const app = express();

// Ensure uploads directories exist on startup (important for Railway deployment)
const uploadsDir = path.join(__dirname, 'uploads');
const uploadsDirs = [
  path.join(uploadsDir, 'cars'),
  path.join(uploadsDir, 'categories'),
];

// Create uploads directories if they don't exist
[uploadsDir, ...uploadsDirs].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Connect to database (non-blocking)
connectDB().catch((err) => {
  console.error('Database connection error:', err.message);
});

// Root route for Railway health checks
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.status(200).json({
    success: true,
    message: 'Backend API is running',
    version: '1.0.0',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API endpoints available at /api/v1',
  });
});

// ✅ CORS Configuration - Always allow localhost and production frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://car-service-blond-five.vercel.app',
  'https://car-service-6cizcir66-future-vision.vercel.app',
  // Add more origins from environment variable if needed
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

// Log allowed origins on startup
console.log('🌐 CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // ALWAYS allow localhost for development/testing (regardless of environment)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log(`✅ Allowed localhost origin: ${origin}`);
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Allowed origin: ${origin}`);
      callback(null, true);
    } else {
      console.error(`❌ Blocked by CORS: ${origin}`);
      console.error(`Allowed origins:`, allowedOrigins);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/blogs', blogRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Handle favicon requests (browsers automatically request this)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // 204 No Content - standard response for missing favicon
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server is running on ${HOST}:${PORT}`.bgMagenta);
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
