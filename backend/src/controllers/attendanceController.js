import prisma from '../../prisma/client.js';

export const checkIn = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        // Check for open session
        const openSession = await prisma.attendance.findFirst({
            where: { userId, checkOut: null },
        });

        if (openSession) {
            return res.status(400).json({ error: 'You already have an active check-in. Please check out first.' });
        }

        const attendance = await prisma.attendance.create({
            data: { userId, checkIn: new Date() },
        });

        res.status(201).json({ attendance, message: 'Checked in successfully!' });
    } catch (error) {
        next(error);
    }
};

export const checkOut = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const openSession = await prisma.attendance.findFirst({
            where: { userId, checkOut: null },
            orderBy: { checkIn: 'desc' },
        });

        if (!openSession) {
            return res.status(400).json({ error: 'No active check-in found' });
        }

        const checkOutTime = new Date();
        const durationMinutes = Math.round(
            (checkOutTime - new Date(openSession.checkIn)) / 60000
        );

        const attendance = await prisma.attendance.update({
            where: { id: openSession.id },
            data: { checkOut: checkOutTime, durationMinutes },
        });

        res.json({ attendance, message: `Checked out! Duration: ${durationMinutes} minutes` });
    } catch (error) {
        next(error);
    }
};

export const todayStatus = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const records = await prisma.attendance.findMany({
            where: {
                userId,
                checkIn: { gte: today, lt: tomorrow },
            },
            orderBy: { checkIn: 'desc' },
        });

        const openSession = records.find((r) => !r.checkOut);

        res.json({ checkedIn: !!openSession, openSession, todayRecords: records });
    } catch (error) {
        next(error);
    }
};

export const history = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { from, to, limit: limitStr } = req.query;
        const limit = parseInt(limitStr) || 30;

        const where = { userId };

        if (from || to) {
            where.checkIn = {};
            if (from) where.checkIn.gte = new Date(from);
            if (to) where.checkIn.lte = new Date(to);
        }

        const records = await prisma.attendance.findMany({
            where,
            orderBy: { checkIn: 'desc' },
            take: limit,
        });

        res.json({ records });
    } catch (error) {
        next(error);
    }
};
