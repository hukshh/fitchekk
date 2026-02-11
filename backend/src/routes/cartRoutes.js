import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { addToCartSchema, updateCartItemSchema, cartItemParamsSchema } from '../validation/cartSchemas.js';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, validate(addToCartSchema), addToCart);
router.put('/:id', authMiddleware, validate(updateCartItemSchema), updateCartItem);
router.delete('/clear', authMiddleware, clearCart);
router.delete('/:id', authMiddleware, validate(cartItemParamsSchema), removeCartItem);

export default router;
