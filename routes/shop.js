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
// Utils
const rootDirectory = require('../utils/path');
// Data
const adminData = require('./admin');

/**
 * Code
 */
const router = express.Router();

// Middlewares
router.get('/', (req, res, next) => {
  console.log('shop.js', adminData.products);
  res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
});

/**
 * Export
 */
module.exports = router;
