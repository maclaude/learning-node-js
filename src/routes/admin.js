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

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
// router.get('/add-product', getAddProduct);

// router.post('/add-product', postAddProduct);

// router.get('/products', getProducts);

// router.get('/edit-product/:productId', getEditProduct);

// router.post('/edit-product', postEditProject);

// router.post('/delete-product', postDeleteProduct);

/**
 * Export
 */
export default router;
