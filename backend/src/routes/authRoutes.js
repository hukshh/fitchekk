import { Router } from 'express';
import { googleLogin } from '../controllers/oauthController.js';
import validate from '../middleware/validate.js';
import { googleLoginSchema } from '../validation/userSchemas.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);

export default router;
