import express from 'express';
import {
  createQuery,
  getQueries,
  getQueryById,
  respondToQuery,
  deleteQuery,
} from '../controllers/queryController.js';
import { protect, requireOfficer } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createQuery)
  .get(protect, getQueries);

router
  .route('/:id')
  .get(protect, getQueryById)
  .delete(protect, deleteQuery);

router.route('/:id/respond').put(protect, requireOfficer, respondToQuery);

export default router;
