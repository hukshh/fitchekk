import prisma from '../../prisma/client.js';

export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const category = await prisma.category.create({
            data: { name, description },
        });

        res.status(201).json({ category });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Category already exists' });
        }
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' },
        });

        res.json({ categories });
    } catch (error) {
        next(error);
    }
};
