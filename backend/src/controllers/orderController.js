import prisma from '../../prisma/client.js';

export const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { shippingAddress } = req.body;

        // Get cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        // Create order with items in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount: Math.round(totalAmount * 100) / 100,
                    shippingAddress,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
                include: { items: { include: { product: true } } },
            });

            // Clear cart
            await tx.cartItem.deleteMany({ where: { userId } });

            return newOrder;
        });

        res.status(201).json({ order, message: 'Order placed successfully!' });
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId },
                include: { items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({ where: { userId } }),
        ]);

        res.json({
            orders,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const id = parseInt(req.params.id);

        const order = await prisma.order.findFirst({
            where: { id, userId },
            include: { items: { include: { product: true } } },
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const id = parseInt(req.params.id);
        const { status } = req.body;

        const existing = await prisma.order.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: { include: { product: true } } },
        });

        res.json({ order });
    } catch (error) {
        next(error);
    }
};
