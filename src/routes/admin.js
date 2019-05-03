/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const adminController = require('../controllers/admin');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProject);

router.post('/delete-product', adminController.postDeleteProduct);

/**
 * Export
 */
module.exports = router;
