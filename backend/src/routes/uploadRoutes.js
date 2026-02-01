// routes/uploadRoutes.js - Image Upload Route (Updated for Cloudinary)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure Cloudinary (do this once globally if possible; here for route isolation)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage (no local disk needed)
const storage = multer.memoryStorage();

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().match(/\.[^.]+$/)[0] || '');
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

// Upload middleware (memory only)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  // Upload buffer to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'cafe-food', // Optional: organizes your uploads in Cloudinary
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      transformation: [
        { quality: 'auto' }, // Auto-optimize
        { fetch_format: 'auto' }
      ]
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: error.message
        });
      }

      // Success: Return Cloudinary secure URL (full HTTPS link)
      res.status(200).json({
        success: true,
        imageUrl: result.secure_url, // e.g. https://res.cloudinary.com/.../v123456789/cafe-food/image-123.jpg
        publicId: result.public_id // Optional: for future delete/update
      });
    }
  );

  // Pipe the file buffer to the upload stream
  const readableStream = Readable.from(req.file.buffer);
  readableStream.pipe(uploadStream);
});

module.exports = router;