/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * NPM import
 */
const express = require('express');

/**
 * Code
 */
const router = express.Router();

// Middlewares
router.get('/add-product', (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

router.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

/**
 * Export
 */
module.exports = router;
