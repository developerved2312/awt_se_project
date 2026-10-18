import express from 'express';
import multer from 'multer';
import {
  analyzePlant,
  getScanHistory,
  getScanById,
} from '../controllers/scanController.js';

const router = express.Router();

// Configure multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed.'), false);
    }
  },
});

/**
 * @route   POST /api/scan/analyze
 * @desc    Analyze a plant leaf photo using Gemini Multimodal Vision / Offline Agronomist
 * @access  Public
 */
router.post('/analyze', upload.single('image'), analyzePlant);

/**
 * @route   GET /api/scan/history
 * @desc    Get recent scan diagnoses (from MongoDB Atlas or memory)
 * @access  Public
 */
router.get('/history', getScanHistory);

/**
 * @route   GET /api/scan/:id
 * @desc    Get detailed diagnosis of a single scan
 * @access  Public
 */
router.get('/:id', getScanById);

export default router;
