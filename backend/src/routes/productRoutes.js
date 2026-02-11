import { Router } from 'express';
import { getProducts, getProduct, createProduct } from '../controllers/productController.js';
import { createCategory, getCategories } from '../controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { listProductsSchema, productParamsSchema, createProductSchema, createCategorySchema } from '../validation/productSchemas.js';

const router = Router();

// Products
router.get('/', validate(listProductsSchema), getProducts);
router.get('/categories', getCategories);
router.get('/:id', validate(productParamsSchema), getProduct);
router.post('/', authMiddleware, validate(createProductSchema), createProduct);

// Categories
router.post('/categories', authMiddleware, validate(createCategorySchema), createCategory);

export default router;
