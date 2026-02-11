import { z } from 'zod';

export const attendanceHistorySchema = z.object({
    query: z.object({
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
        limit: z.string().regex(/^\d+$/).optional(),
    }).optional(),
});
