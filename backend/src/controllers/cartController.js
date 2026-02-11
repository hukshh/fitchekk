import prisma from '../../prisma/client.js';

export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const items = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: { include: { category: true } } },
            orderBy: { createdAt: 'desc' },
        });

        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        res.json({ items, total: Math.round(total * 100) / 100, count: items.length });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { productId, quantity } = req.body;

        // Verify product exists and has stock
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Upsert: increment quantity if already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });

        let item;
        if (existingItem) {
            item = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + (quantity || 1) },
                include: { product: true },
            });
        } else {
            item = await prisma.cartItem.create({
                data: { userId, productId, quantity: quantity || 1 },
                include: { product: true },
            });
        }

        res.status(201).json({ item });
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const id = parseInt(req.params.id);
        const { quantity } = req.body;

        const existingItem = await prisma.cartItem.findFirst({
            where: { id, userId },
        });

        if (!existingItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        const item = await prisma.cartItem.update({
            where: { id },
            data: { quantity },
            include: { product: true },
        });

        res.json({ item });
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const id = parseInt(req.params.id);

        const existingItem = await prisma.cartItem.findFirst({
            where: { id, userId },
        });

        if (!existingItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await prisma.cartItem.delete({ where: { id } });

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        await prisma.cartItem.deleteMany({ where: { userId } });

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};
