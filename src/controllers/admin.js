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
  const product = new Product(null, title, imageUrl, description, price);
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

exports.postEditProject = (req, res, next) => {
  const {
    productId,
    title,
    imageUrl,
    description,
    price,
  } = req.body;

  const updatedProduct = new Product(productId, title, imageUrl, description, price);

  updatedProduct.save();

  res.redirect('/admin/products');
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

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};
