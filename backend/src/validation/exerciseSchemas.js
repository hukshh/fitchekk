import { z } from 'zod';

export const createExerciseSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Exercise name is required').max(100),
        muscleGroup: z.string().max(50).optional(),
    }),
});

export const listExercisesSchema = z.object({
    query: z.object({
        q: z.string().optional(),
    }).optional(),
});
