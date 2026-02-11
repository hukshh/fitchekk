import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Route imports
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// --- Global Middleware ---
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(generalLimiter);

// --- Health Check ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// --- 404 Handler ---
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// --- Global Error Handler ---
app.use(errorHandler);

// --- Start Server ---
const PORT = parseInt(env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`🚀 FitFusion API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
