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

/**
 * Code
 */
const router = express.Router();

// Middlewares

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDirectory, 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

/**
 * Export
 */
module.exports = router;
