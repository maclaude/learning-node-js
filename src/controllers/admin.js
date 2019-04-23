/* eslint-disable no-unused-vars */
// Admin Controller

/**
 * Local import
 */
// Model
const Product = require('../models/product');

/**
 * Callback functions
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
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
    res.render('admin/product-list', {
      items: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
