import { z } from 'zod';

export const createWorkoutSchema = z.object({
    body: z.object({
        title: z.string().max(100).optional(),
        date: z.string().datetime().optional(),
    }),
});

export const addSetSchema = z.object({
    body: z.object({
        exerciseId: z.number().int().positive('Exercise ID is required'),
        reps: z.number().int().positive('Reps must be positive'),
        weight: z.number().positive().optional().nullable(),
        rpe: z.number().min(1).max(10).optional().nullable(),
        order: z.number().int().optional().nullable(),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid workout ID'),
    }),
});

export const workoutParamsSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid workout ID'),
    }),
});
