import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { createOrderSchema, orderParamsSchema, updateOrderStatusSchema } from '../validation/orderSchemas.js';

const router = Router();

router.post('/', authMiddleware, validate(createOrderSchema), createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, validate(orderParamsSchema), getOrder);
router.put('/:id/status', authMiddleware, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
