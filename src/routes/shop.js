/**
 * NPM import
 */
import express from 'express';

/**
 * Local import
 */
// Controllers middleware functions
import {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
} from '../controllers/shop';

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

// router.post('/cart-delete-item', postCartDeleteProduct);

// router.post('/create-order', postOrder);

// router.get('/orders', getOrders);

/**
 * Export
 */
export default router;
