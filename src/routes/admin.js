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
  postEditProject,
  postDeleteProduct,
} from '../controllers/admin';
// Checking authentication middleware
import isAuth from '../middlewares/is-auth';

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/add-product', isAuth, getAddProduct);

router.post('/add-product', isAuth, postAddProduct);

router.get('/products', isAuth, getProducts);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product', isAuth, postEditProject);

router.post('/delete-product', isAuth, postDeleteProduct);

/**
 * Export
 */
export default router;
