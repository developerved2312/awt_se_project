import express from 'express';
import {
  createQuery,
  getQueries,
  getQueryById,
  respondToQuery,
  deleteQuery,
} from '../controllers/queryController.js';
import { protect, optionalAuth, requireOfficer } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createQuery)
  .get(optionalAuth, getQueries);

router
  .route('/:id')
  .get(protect, getQueryById)
  .delete(protect, deleteQuery);

router.route('/:id/respond').put(protect, requireOfficer, respondToQuery);

export default router;
