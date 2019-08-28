/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const adminController = require('../controllers/admin');
// Checking authentication middleware
const isAuth = require('../middlewares/is-auth');
// Utils
const productFormValidation = require('../utils/admin-validation');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
  '/add-product',
  isAuth,
  productFormValidation,
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  isAuth,
  productFormValidation,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

/**
 * Export
 */
module.exports = router;
