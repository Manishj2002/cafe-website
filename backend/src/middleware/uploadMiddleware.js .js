// middleware/uploadMiddleware.js - Multer + Cloudinary Upload Middleware
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// IMPORTANT: Configure Cloudinary once (best in a separate config file, but ok here too)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage → file goes to buffer, not disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().match(/\.[^.]+$/)[0]);
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Custom middleware to upload buffer to Cloudinary and attach URL
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next(); // No file → continue (e.g. optional upload)
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'cafe-food',          // optional: organizes in Cloudinary dashboard
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      transformation: [
        { quality: 'auto' },        // optional: auto-optimize
        { fetch_format: 'auto' }
      ]
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Image upload failed', error: error.message });
      }

      // Attach Cloudinary secure URL to req
      req.cloudinaryUrl = result.secure_url;
      req.cloudinaryPublicId = result.public_id; // optional: save if you want to delete later
      next();
    }
  );

  // Pipe buffer to Cloudinary stream
  const readableStream = Readable.from(req.file.buffer);
  readableStream.pipe(uploadStream);
};

module.exports = { upload, uploadToCloudinary };