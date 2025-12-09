// Centralized error handling middleware

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console (in production, consider using a logging service)
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = error.statusCode === 500 && !isDevelopment
    ? 'Internal server error'
    : (error.message || 'Server Error');

  res.status(error.statusCode || 500).json({
    success: false,
    message: errorMessage,
    ...(isDevelopment && { stack: err.stack }), // Only show stack in development
  });
};

// Not found middleware
export const notFound = (req, res, next) => {
  // Handle API routes with proper JSON response
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      path: req.originalUrl,
      method: req.method,
    });
  }
  
  // Handle missing static files (uploads) with proper 404 JSON response
  if (req.originalUrl.startsWith('/uploads')) {
    return res.status(404).json({
      success: false,
      message: 'Image not found',
      path: req.originalUrl
    });
  }
  
  // For other routes, create error as before
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

