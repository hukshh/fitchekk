import { Router } from 'express';
import { createWorkout, listWorkouts, getWorkout, addSet } from '../controllers/workoutController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { createWorkoutSchema, addSetSchema, workoutParamsSchema } from '../validation/workoutSchemas.js';

const router = Router();

router.post('/', authMiddleware, validate(createWorkoutSchema), createWorkout);
router.get('/', authMiddleware, listWorkouts);
router.get('/:id', authMiddleware, validate(workoutParamsSchema), getWorkout);
router.post('/:id/sets', authMiddleware, validate(addSetSchema), addSet);

export default router;
