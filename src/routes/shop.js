/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const shopController = require('../controllers/shop');

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

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

/**
 * Export
 */
module.exports = router;
