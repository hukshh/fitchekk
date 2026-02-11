import { Router } from 'express';
import { checkIn, checkOut, todayStatus, history } from '../controllers/attendanceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { attendanceHistorySchema } from '../validation/attendanceSchemas.js';

const router = Router();

router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);
router.get('/today', authMiddleware, todayStatus);
router.get('/history', authMiddleware, validate(attendanceHistorySchema), history);

export default router;
