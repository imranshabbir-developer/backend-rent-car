import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Create a multer instance for file uploads with automatic folder creation
 * @param {string} folderName - Name of the folder to store uploads (e.g., 'categories', 'products')
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @param {array} allowedMimeTypes - Array of allowed MIME types (default: all image types)
 * @returns {object} Multer instance
 */
const createUploadMiddleware = (
  folderName,
  maxSize = 5 * 1024 * 1024,
  allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon',
  ]
) => {
  // Create directory for specific route if it doesn't exist
  const directory = path.join(uploadsDir, folderName);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      // Generate unique filename: timestamp-randomnumber-originalname
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, fileExtension);
      const sanitizedBaseName = baseName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      cb(null, `${sanitizedBaseName}-${uniqueSuffix}${fileExtension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
        ),
        false
      );
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxSize,
    },
  });

  return upload;
};

/**
 * Error handler for multer errors
 */
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large',
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  
  next();
};

export { createUploadMiddleware, handleUploadError };

