import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
    JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    FRONTEND_URL: z.string().optional().default('http://localhost:5173'),
    PORT: z.string().optional().default('3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

const env = parsed.data;

export default env;
