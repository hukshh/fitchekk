import { z } from 'zod';

export const listProductsSchema = z.object({
    query: z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
    }).optional(),
});

export const productParamsSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid product ID'),
    }),
});

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Product name is required').max(200),
        description: z.string().max(1000).optional(),
        price: z.number().positive('Price must be positive'),
        imageUrl: z.string().url().optional().nullable(),
        stock: z.number().int().min(0).optional().default(0),
        categoryId: z.number().int().positive('Category ID is required'),
    }),
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Category name is required').max(100),
        description: z.string().max(500).optional(),
    }),
});
