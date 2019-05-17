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
  getInvoice,
  getCheckout,
} from '../controllers/shop';
// Checking authentication middleware
import isAuth from '../middlewares/is-auth';

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

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);

router.get('/orders/:orderId', isAuth, getInvoice);

router.get('/checkout', isAuth, getCheckout);

/**
 * Export
 */
export default router;
