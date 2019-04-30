/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// Admin Controller

/**
 * Local import
 */
// Model
const Product = require('../models/product');

/**
 * Code
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

  req.user
    // Method created with the Models association in server.js
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    .then((result) => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  // Adding a query parameter
  const editMode = req.query.edit;

  if (!editMode) {
    res.redirect('/');
  } else {
    const { productId } = req.params;

    req.user
      .getProducts({ where: { id: productId } })
      .then((products) => {
        const product = products[0];
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
      })
      .catch(err => console.log(err));
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

  Product.findByPk(productId)
    .then((product) => {
      const updateProduct = product;
      updateProduct.title = title;
      updateProduct.imageUrl = imageUrl;
      updateProduct.description = description;
      updateProduct.pruce = price;
      // Saving the update
      return updateProduct.save();
    })
    .then((result) => {
      console.log('Updated product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Get all the products
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/product-list', {
        items: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then(product => product.destroy())
    .then((result) => {
      console.log('destroyed product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
