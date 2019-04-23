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
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    price,
  } = req.body;

  // Instance Product class
  const product = new Product(title, imageUrl, description, price);
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
