/* eslint-disable no-unused-vars */
// Products Controller

/**
 * Local import
 */
// Models
const Product = require('../models/product');

/**
 * Callback functions
 */
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      items: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = (req, res, next) => {
  // Get all the products
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      items: products,
      pageTitle: 'Products',
      path: '/products',
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      item: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
