/**
 * NPM import
 */
import express from 'express';

/**
 * Local import
 */
// Controllers middleware functions
import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} from '../controllers/admin';
// Checking authentication middleware
import isAuth from '../middlewares/is-auth';
// Utils
import productFormValidation from '../utils/admin-validation';

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/add-product', isAuth, getAddProduct);

router.post('/add-product', isAuth, productFormValidation, postAddProduct);

router.get('/products', isAuth, getProducts);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product', isAuth, productFormValidation, postEditProduct);

router.delete('/product/:productId', isAuth, deleteProduct);

/**
 * Export
 */
export default router;
