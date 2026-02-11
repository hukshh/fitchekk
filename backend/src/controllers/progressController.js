import prisma from '../../prisma/client.js';

export const logProgress = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { weight, bodyFat } = req.body;

        const log = await prisma.progressLog.create({
            data: { userId, weight, bodyFat },
        });

        res.status(201).json({ progress: log });
    } catch (error) {
        next(error);
    }
};

export const getProgress = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const limit = parseInt(req.query.limit) || 30;

        const logs = await prisma.progressLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: limit,
        });

        res.json({ progress: logs });
    } catch (error) {
        next(error);
    }
};
