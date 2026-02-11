import { OAuth2Client } from 'google-auth-library';
import prisma from '../../prisma/client.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateToken = (user_id) => {
    return jwt.sign({ user_id }, env.JWT_SECRET, { expiresIn: '7d' });
};

export const googleLogin = async (req, res, next) => {
    try {
        const { credential } = req.body;

        if (!env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ error: 'Google OAuth is not configured' });
        }

        const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Find or create user
        let user = await prisma.user.findUnique({ where: { user_email: email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    user_name: name || email.split('@')[0],
                    user_email: email,
                    user_password: '', // OAuth users have no password
                },
            });
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
        if (error.message?.includes('Token used too late') || error.message?.includes('Invalid token')) {
            return res.status(401).json({ error: 'Invalid Google token' });
        }
        next(error);
    }
};
