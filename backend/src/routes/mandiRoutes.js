import express from 'express';
import {
  getLatestPrices,
  getMandiSummary,
  getMandiDirectory,
  syncRealTimePrices,
} from '../controllers/mandiController.js';

const router = express.Router();

/**
 * @route   GET /api/mandi/prices
 * @desc    Fetch real-time commodity prices across Vadodara district APMCs
 * @access  Public
 */
router.get('/prices', getLatestPrices);

/**
 * @route   GET /api/mandi/summary
 * @desc    Get market summary, top gainers, arbitrage spread, and sentiment
 * @access  Public
 */
router.get('/summary', getMandiSummary);

/**
 * @route   GET /api/mandi/directory
 * @desc    Get operational info and contacts for Vadodara APMC market yards
 * @access  Public
 */
router.get('/directory', getMandiDirectory);

/**
 * @route   POST /api/mandi/sync
 * @desc    Trigger real-time mandi price sync & update MongoDB Atlas
 * @access  Public (or Officers)
 */
router.post('/sync', syncRealTimePrices);

export default router;
