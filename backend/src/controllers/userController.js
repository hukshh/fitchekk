import prisma from '../../prisma/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateToken = (user_id) => {
    return jwt.sign({ user_id }, env.JWT_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res, next) => {
    try {
        const { user_name, user_email, user_password } = req.body;

        const existing = await prisma.user.findUnique({ where: { user_email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(user_password, 12);

        const user = await prisma.user.create({
            data: { user_name, user_email, user_password: hashedPassword },
        });

        const token = generateToken(user.user_id);

        res.status(201).json({
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                xp: user.xp,
                streak: user.streak,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { user_email, user_password } = req.body;

        // Allow login by email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { user_email: user_email },
                    { user_name: user_email },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Block password login for OAuth-only users
        if (!user.user_password || user.user_password === '') {
            return res.status(401).json({ error: 'This account uses Google Sign-In. Please login with Google.' });
        }

        const validPassword = await bcrypt.compare(user_password, user.user_password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.user_id);

        res.json({
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                xp: user.xp,
                streak: user.streak,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.user.user_id },
            select: {
                user_id: true,
                user_name: true,
                user_email: true,
                xp: true,
                streak: true,
                lastWorkout: true,
                createdAt: true,
                _count: {
                    select: {
                        workouts: true,
                        attendances: true,
                        orders: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { user_name, user_email } = req.body;

        if (user_email) {
            const existing = await prisma.user.findFirst({
                where: { user_email, NOT: { user_id: req.user.user_id } },
            });
            if (existing) {
                return res.status(409).json({ error: 'Email already in use' });
            }
        }

        const user = await prisma.user.update({
            where: { user_id: req.user.user_id },
            data: {
                ...(user_name && { user_name }),
                ...(user_email && { user_email }),
            },
            select: {
                user_id: true,
                user_name: true,
                user_email: true,
                xp: true,
                streak: true,
            },
        });

        res.json({ user });
    } catch (error) {
        next(error);
    }
};
