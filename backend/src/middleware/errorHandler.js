const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Zod validation error
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors,
        });
    }

    // Prisma known request error
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'A record with this value already exists',
            details: err.meta,
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Record not found',
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal server error',
    });
};

export default errorHandler;
