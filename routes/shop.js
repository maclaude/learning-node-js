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
// Data
const adminData = require('./admin');

/**
 * Code
 */
const router = express.Router();

// Middlewares
router.get('/', (req, res, next) => {
  const { products } = adminData;
  res.render('shop',
    {
      items: products,
      pageTitle: 'My shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      // If not using the layout which is by default
      // layout: false,
    });
});

/**
 * Export
 */
module.exports = router;
