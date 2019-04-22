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

const products = [];

// Middlewares

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product' });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({
    title: req.body.title,
  });
  res.redirect('/');
});

/**
 * Export
 */
exports.routes = router;
exports.products = products;
