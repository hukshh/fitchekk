import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per window
    message: { error: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
