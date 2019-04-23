/* eslint-disable no-unused-vars */
// Products Controller

/**
 * Code
 */
// Model
const Product = require('../models/product');

/**
 * Callback functions
 */
exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeProducts: true,
    formCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  // Instance Product class
  const product = new Product(req.body.title);
  // Saving the instance
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  // Get all the products
  Product.fetchAll((products) => {
    res.render('shop', {
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
};
