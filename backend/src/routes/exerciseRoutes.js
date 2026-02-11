import { Router } from 'express';
import { createExercise, listExercises } from '../controllers/exerciseController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { createExerciseSchema, listExercisesSchema } from '../validation/exerciseSchemas.js';

const router = Router();

router.post('/', authMiddleware, validate(createExerciseSchema), createExercise);
router.get('/', authMiddleware, validate(listExercisesSchema), listExercises);

export default router;
