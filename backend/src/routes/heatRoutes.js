import express from 'express';
import { getWardThermalProfiles, simulateTreeCooling } from '../controllers/heatController.js';

const router = express.Router();

/**
 * @route   GET /api/heat/wards
 * @desc    Get thermal profiles, surface temperatures, and NDVI for Vadodara wards
 * @access  Public
 */
router.get('/wards', getWardThermalProfiles);

/**
 * @route   POST /api/heat/simulate
 * @desc    Simulate tree cooling impact on urban microclimate
 * @access  Public
 */
router.post('/simulate', simulateTreeCooling);

export default router;
