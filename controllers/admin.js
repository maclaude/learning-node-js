// Admin Controller

/**
 * NPM import
 */
const validationResult = require('express-validator/check');

/**
 * Local import
 */
// Models
const Product = require('../models/product');
// Utils
const errorHandler = require('../utils/error-handler');
const deleteFile = require('../utils/delete-file');

/**
 * Code
 */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, price } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not an image',
      item: { title, description, price },
      validationErrors: [],
    });
  }

  const errors = validationResult(req);
  // If there is errors, set status code 422 and re-render the page
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      item: { title, description, price },
      validationErrors: errors.array(),
    });
  }

  // Image URL for database entry
  const imageUrl = `images/${image.filename}`;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  return product
    .save()
    .then(response => {
      console.log('Product created');
      res.redirect('/admin/products');
    })
    .catch(errorHandler(next));
};

exports.getProducts = (req, res, next) => {
  const { _id: currentUserId } = req.user;
  // Filtering products of the current logged in user
  Product.find({ userId: currentUserId })
    .then(products => {
      res.render('admin/product-list', {
        items: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(errorHandler(next));
};

exports.getEditProduct = (req, res, next) => {
  // Adding a query parameter (optionnal)
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const { productId } = req.params;

  return Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }

      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        errorMessage: null,
        item: product,
        validationErrors: [],
      });
    })
    .catch(errorHandler(next));
};

exports.postEditProduct = (req, res, next) => {
  const { title, price, description, productId } = req.body;
  const { _id: currentUserId } = req.user;
  const image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      item: { title, description, price, _id: productId },
      validationErrors: errors.array(),
    });
  }

  return Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== currentUserId.toString()) {
        return res.redirect('/');
      }

      // Image URL for database entry
      const imageUrl = `images/${image.filename}`;

      const updatedProduct = product;
      updatedProduct.title = title;
      updatedProduct.price = price;
      updatedProduct.description = description;
      if (image) {
        // Deleting previous image
        deleteFile(`src/${product.imageUrl}`);
        updatedProduct.imageUrl = imageUrl;
      }

      return updatedProduct
        .save()
        .then(response => {
          console.log('Product updated');
          res.redirect('/admin/products');
        })
        .catch(errorHandler(next));
    })
    .catch(errorHandler(next));
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  const { _id: currentUserId } = req.user;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return next(new Error('Product Not Found'));
      }
      // Deleting previous image
      deleteFile(`src/${product.imageUrl}`);
      return Product.deleteOne({ _id: productId, userId: currentUserId });
    })
    .then(response => {
      console.log('Product deleted');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Deleting product failed' });
    });
};
