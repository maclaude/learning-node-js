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
  res.render('shop');
});

/**
 * Export
 */
module.exports = router;
