import prisma from '../../prisma/client.js';

export const getProducts = async (req, res, next) => {
    try {
        const { category, search, page: pageStr, limit: limitStr } = req.query;
        const page = parseInt(pageStr) || 1;
        const limit = parseInt(limitStr) || 20;
        const skip = (page - 1) * limit;

        const where = {};

        if (category) {
            where.category = { name: { equals: category, mode: 'insensitive' } };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        res.json({
            products,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, imageUrl, stock, categoryId } = req.body;

        const product = await prisma.product.create({
            data: { name, description, price, imageUrl, stock, categoryId },
            include: { category: true },
        });

        res.status(201).json({ product });
    } catch (error) {
        next(error);
    }
};
