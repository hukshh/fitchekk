import { Router } from 'express';
import { logProgress, getProgress } from '../controllers/progressController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, logProgress);
router.get('/', authMiddleware, getProgress);

export default router;
