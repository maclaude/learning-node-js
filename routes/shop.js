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
  res.render('shop', { items: products, title: 'My shop' });
});

/**
 * Export
 */
module.exports = router;
