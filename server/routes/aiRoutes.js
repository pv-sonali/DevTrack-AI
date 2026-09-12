import express from 'express';
import { generateCareerAdvice } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/suggest', generateCareerAdvice);

export default router;
