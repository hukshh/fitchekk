import { z } from 'zod';

export const addToCartSchema = z.object({
    body: z.object({
        productId: z.number().int().positive('Product ID is required'),
        quantity: z.number().int().positive().optional().default(1),
    }),
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().positive('Quantity must be positive'),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid cart item ID'),
    }),
});

export const cartItemParamsSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid cart item ID'),
    }),
});
