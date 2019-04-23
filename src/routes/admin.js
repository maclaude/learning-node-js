/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * NPM import
 */
const express = require('express');
const dotenv = require('dotenv');

/**
 * Local import
 */
// Environment variables
// process.env.PROPSNAME
dotenv.config();

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

/**
 * Export
 */
module.exports = router;
