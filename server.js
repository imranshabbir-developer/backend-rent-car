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
import mainBlogRoutes from './routes/mainBlogRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import specialSectionRoutes from './routes/specialSectionRoutes.js';
import contactQueryRoutes from './routes/contactQueryRoutes.js';

// Production security packages
import rateLimit from 'express-rate-limit';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate required environment variables (only in production)
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:'.red);
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('Please set these in your .env file or environment.'.red);
    process.exit(1);
  }
}

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
  // In production, exit on unhandled rejection
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Initialize Express app
const app = express();

// ============================================
// PRODUCTION SECURITY MIDDLEWARE
// ============================================

// 1. Basic Security Headers (without Helmet to avoid CORP conflicts)
app.use((req, res, next) => {
  // Only set security headers for non-upload routes
  if (!req.path.startsWith('/uploads')) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  next();
});

// 2. Rate Limiting - Prevents DDoS and brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. Compression - Reduces bandwidth usage
app.use(compression());

// ============================================
// BASIC MIDDLEWARE
// ============================================

// Ensure uploads directories exist on startup (important for Railway deployment)
const uploadsDir = path.join(__dirname, 'uploads');
const uploadsDirs = [
  path.join(uploadsDir, 'cars'),
  path.join(uploadsDir, 'categories'),
  path.join(uploadsDir, 'main-blogs'),
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
  const healthPayload = {
    success: true,
    message: 'Backend API is running...!!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  };

  res.format({
    'application/json': () => {
      res.status(200).json(healthPayload);
    },
    'text/html': () => {
      res
        .status(200)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(JSON.stringify(healthPayload, null, 2));
    },
    default: () => {
      res.status(200).json(healthPayload);
    },
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API endpoints available at /api/v1',
  });
});

// ✅ CORS Configuration - Allow specific origins with all methods
const allowedOrigins = [
  'http://localhost:3000',
  'https://car-service-blond-five.vercel.app',
  'https://car-service-qiezfggti-future-vision.vercel.app',
  'https://convoytravels.knowledgeorbit.com',
  'https://convoytravels.pk',
  'https://api.convoytravels.pk', // Add if needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (for direct image access, Postman, curl, etc.)
    // This is important for <img> tags which may not send origin header
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Check if origin is from convoytravels.pk domain (allow subdomains)
      if (origin.includes('convoytravels.pk')) {
        callback(null, true);
      } else {
        // Log blocked requests for debugging
        console.warn(`⚠️ CORS blocked request from: ${origin}`);
        // In production, be more strict
        if (process.env.NODE_ENV === 'production') {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        } else {
          // In development, be more permissive
          callback(null, true);
        }
      }
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

// Request size limits (prevent large payload attacks)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request timeout (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({
      success: false,
      message: 'Request timeout',
    });
  });
  next();
});

// Logging - use 'combined' format in production for better logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve static files from uploads directory with security and CORS headers
// IMPORTANT: Images are public assets, so we allow all origins for CORS
app.use('/uploads', (req, res, next) => {
  // CRITICAL: Remove any existing CORP header that might block requests
  res.removeHeader('Cross-Origin-Resource-Policy');
  
  // Always allow CORS for images (public assets)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // CRITICAL: Set Cross-Origin-Resource-Policy to allow cross-origin access
  // This MUST be set to 'cross-origin' to fix ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Set security headers for uploaded files
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Cache control for images (1 day) - but add must-revalidate to prevent stale cache
  res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
  
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  // Additional static file options
  maxAge: '1d',
  etag: true,
  lastModified: true,
  // Set proper MIME types and CORS headers
  setHeaders: (res, filePath) => {
    // CRITICAL: Remove any existing CORP header first
    res.removeHeader('Cross-Origin-Resource-Policy');
    
    // CRITICAL: Set Cross-Origin-Resource-Policy for each file
    // This fixes ERR_BLOCKED_BY_RESPONSE.NotSameOrigin error
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Ensure proper content type for images
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    }
  },
}));

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/main-blogs', mainBlogRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/special-sections', specialSectionRoutes);
app.use('/api/v1/contact-queries', contactQueryRoutes);

// Test image serving endpoint
app.get('/api/v1/test-image', (req, res) => {
  const uploadsPath = path.join(__dirname, 'uploads');
  const carsPath = path.join(uploadsPath, 'cars');
  
  // Get list of files in cars directory
  let carFiles = [];
  try {
    if (fs.existsSync(carsPath)) {
      carFiles = fs.readdirSync(carsPath).slice(0, 5); // Get first 5 files
    }
  } catch (err) {
    console.error('Error reading cars directory:', err);
  }
  
  const testFiles = {
    uploadsDir: uploadsPath,
    exists: fs.existsSync(uploadsPath),
    carsDir: fs.existsSync(carsPath),
    categoriesDir: fs.existsSync(path.join(uploadsPath, 'categories')),
    mainBlogsDir: fs.existsSync(path.join(uploadsPath, 'main-blogs')),
    carFilesCount: carFiles.length,
    sampleCarFiles: carFiles,
  };
  
  // Build sample image URLs
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const sampleImageUrls = carFiles.length > 0 
    ? carFiles.map(file => `${baseUrl}/uploads/cars/${file}`)
    : [];
  
  res.json({
    success: true,
    message: 'Image serving test',
    testFiles,
    staticRoute: '/uploads',
    baseUrl: baseUrl,
    sampleImageUrls: sampleImageUrls,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Enhanced health check route
app.get('/api/v1/health', (req, res) => {
  const health = {
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };
  
  const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
  res.status(statusCode).json(health);
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
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`.cyan);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/api/v1/health`.cyan);
});

// Graceful shutdown handlers
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

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
