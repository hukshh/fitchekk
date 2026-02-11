import { z } from 'zod';

export const createOrderSchema = z.object({
    body: z.object({
        shippingAddress: z.string().min(5, 'Shipping address is required').max(500),
    }),
});

export const orderParamsSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid order ID'),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
            errorMap: () => ({ message: 'Status must be: pending, processing, shipped, delivered, or cancelled' }),
        }),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid order ID'),
    }),
});
