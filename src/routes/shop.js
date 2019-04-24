/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Node Core Modules import
 */
const path = require('path');

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

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

/**
 * Export
 */
module.exports = router;
