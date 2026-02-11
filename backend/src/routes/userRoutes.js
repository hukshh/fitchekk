import { Router } from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { signupSchema, loginSchema, updateProfileSchema } from '../validation/userSchemas.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

export default router;
