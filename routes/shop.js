/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const shopController = require('../controllers/shop');
// Checking authentication middleware
const isAuth = require('../middlewares/is-auth');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);

/**
 * Export
 */
module.exports = router;
