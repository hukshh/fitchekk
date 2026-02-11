import prisma from '../../prisma/client.js';

// XP & Streak logic
const updateXpAndStreak = async (userId) => {
    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    const now = new Date();
    let newStreak = user.streak;

    if (user.lastWorkout) {
        const lastDate = new Date(user.lastWorkout);
        const diffMs = now - lastDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak += 1; // consecutive day
        } else if (diffDays === 0) {
            // same day, no change
        } else {
            newStreak = 1; // streak reset
        }
    } else {
        newStreak = 1; // first workout ever
    }

    await prisma.user.update({
        where: { user_id: userId },
        data: {
            xp: { increment: 10 },
            streak: newStreak,
            lastWorkout: now,
        },
    });

    return { xpEarned: 10, newStreak };
};

export const createWorkout = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { title, date } = req.body;

        const workout = await prisma.workout.create({
            data: {
                userId,
                title: title || `Workout ${new Date().toLocaleDateString()}`,
                date: date ? new Date(date) : new Date(),
            },
            include: { sets: { include: { exercise: true } } },
        });

        // Award XP and update streak
        const stats = await updateXpAndStreak(userId);

        res.status(201).json({ workout, ...stats });
    } catch (error) {
        next(error);
    }
};

export const listWorkouts = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [workouts, total] = await Promise.all([
            prisma.workout.findMany({
                where: { userId },
                include: {
                    sets: {
                        include: { exercise: true },
                        orderBy: { order: 'asc' },
                    },
                },
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            prisma.workout.count({ where: { userId } }),
        ]);

        res.json({
            workouts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

export const getWorkout = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const id = parseInt(req.params.id);

        const workout = await prisma.workout.findFirst({
            where: { id, userId },
            include: {
                sets: {
                    include: { exercise: true },
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.json({ workout });
    } catch (error) {
        next(error);
    }
};

export const addSet = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const workoutId = parseInt(req.params.id);
        const { exerciseId, reps, weight, rpe, order } = req.body;

        // Verify workout ownership
        const workout = await prisma.workout.findFirst({
            where: { id: workoutId, userId },
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        // Verify exercise exists (user's or global)
        const exercise = await prisma.exercise.findFirst({
            where: {
                id: exerciseId,
                OR: [{ userId: null }, { userId }],
            },
        });

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        const set = await prisma.workoutSet.create({
            data: { workoutId, exerciseId, reps, weight, rpe, order },
            include: { exercise: true },
        });

        res.status(201).json({ set });
    } catch (error) {
        next(error);
    }
};
