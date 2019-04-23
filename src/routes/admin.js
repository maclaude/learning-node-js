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
const productsController = require('../controllers/products');

/**
 * Code
 */
const router = express.Router();

// Middlewares

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

/**
 * Export
 */
module.exports = router;
