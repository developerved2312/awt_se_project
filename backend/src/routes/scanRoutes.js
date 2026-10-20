import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import {
  analyzePlant,
  getScanHistory,
  getScanById,
  deleteScan,
} from '../controllers/scanController.js';

const router = express.Router();

/**
 * @route   POST /api/scan/analyze
 * @desc    Analyze a plant leaf photo using Gemini Multimodal Vision / Offline Agronomist
 * @access  Public (optional user authentication)
 */
router.post('/analyze', optionalAuth, upload.single('image'), analyzePlant);

/**
 * @route   GET /api/scan/history
 * @desc    Get recent scan diagnoses (from MongoDB Atlas or fallback memory)
 * @access  Public
 */
router.get('/history', getScanHistory);

/**
 * @route   GET /api/scan/:id
 * @desc    Get detailed diagnosis of a single scan
 * @access  Public
 */
router.get('/:id', getScanById);

/**
 * @route   DELETE /api/scan/:id
 * @desc    Delete a scan from MongoDB Atlas and clean up disk image
 * @access  Public
 */
router.delete('/:id', deleteScan);

export default router;
