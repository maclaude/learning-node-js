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
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
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

exports.getEditProduct = (req, res, next) => {
  // Adding a query parameter
  const editMode = req.query.edit;

  if (!editMode) {
    res.redirect('/');
  } else {
    const { productId } = req.params;

    Product.findById(productId, (product) => {
      if (!product) {
        res.redirect('/');
      } else {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          item: product,
        });
      }
    });
  }
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
