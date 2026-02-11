import prisma from '../../prisma/client.js';

export const createExercise = async (req, res, next) => {
    try {
        const { name, muscleGroup } = req.body;
        const userId = req.user.user_id;

        const exercise = await prisma.exercise.create({
            data: { name, muscleGroup, userId },
        });

        res.status(201).json({ exercise });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'You already have an exercise with this name' });
        }
        next(error);
    }
};

export const listExercises = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { q } = req.query;

        const where = {
            OR: [
                { userId: null },   // Global exercises
                { userId },          // User's custom exercises
            ],
        };

        if (q) {
            where.AND = {
                name: { contains: q, mode: 'insensitive' },
            };
        }

        const exercises = await prisma.exercise.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        res.json({ exercises });
    } catch (error) {
        next(error);
    }
};
