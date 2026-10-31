const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'course-images');
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// Ensure the destination directory exists (uploads/course-images is kept
// in git via .gitkeep, but a fresh clone/deploy may still be missing it).
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `course-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext);

  if (!isAllowed) {
    return cb(ApiError.badRequest('Thumbnail must be a JPG, JPEG, PNG, or WEBP image'));
  }
  return cb(null, true);
}

const uploadCourseImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

module.exports = uploadCourseImage;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
