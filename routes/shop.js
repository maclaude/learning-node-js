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
const productsController = require('../controllers/products');

/**
 * Code
 */
const router = express.Router();

// Middlewares
router.get('/', productsController.getProducts);

/**
 * Export
 */
module.exports = router;
