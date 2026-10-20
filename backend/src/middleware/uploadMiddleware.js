import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory path
export const UPLOADS_DIR = path.resolve(__dirname, '../../public/uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage: memory storage to allow processing/inspection before writing
const storage = multer.memoryStorage();

// File filter for images (JPEG, PNG, WebP)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

/**
 * Saves a buffer directly to public/uploads directory.
 * @param {Buffer} buffer - File buffer
 * @param {string} [ext='.jpg'] - File extension
 * @returns {string} Relative URL path, e.g. "/uploads/leaf_17294029482.jpg"
 */
export const saveBufferToUploads = (buffer, ext = '.jpg') => {
  const safeExt = ext.startsWith('.') ? ext : `.${ext}`;
  const filename = `leaf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${safeExt}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

/**
 * Decodes and saves a base64 image string to public/uploads.
 * @param {string} base64String - Full or raw base64 data
 * @returns {{ relativeUrl: string, base64Data: string, mimeType: string }}
 */
export const saveBase64ToUploads = (base64String) => {
  let base64Data = base64String;
  let mimeType = 'image/jpeg';
  let ext = '.jpg';

  if (base64String.startsWith('data:')) {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
      if (mimeType.includes('png')) ext = '.png';
      else if (mimeType.includes('webp')) ext = '.webp';
    }
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const relativeUrl = saveBufferToUploads(buffer, ext);

  return {
    relativeUrl,
    base64Data,
    mimeType,
  };
};

export default {
  upload,
  saveBufferToUploads,
  saveBase64ToUploads,
  UPLOADS_DIR,
};
