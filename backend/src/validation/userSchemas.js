import { z } from 'zod';

export const signupSchema = z.object({
    body: z.object({
        user_name: z.string().min(2, 'Name must be at least 2 characters').max(50),
        user_email: z.string().email('Invalid email address'),
        user_password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        user_email: z.string().min(1, 'Email or username is required'),
        user_password: z.string().min(1, 'Password is required'),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        user_name: z.string().min(2).max(50).optional(),
        user_email: z.string().email().optional(),
    }),
});

export const googleLoginSchema = z.object({
    body: z.object({
        credential: z.string().min(1, 'Google credential is required'),
    }),
});
