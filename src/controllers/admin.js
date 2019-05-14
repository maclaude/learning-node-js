// Admin Controller

/**
 * NPM import
 */
import { validationResult } from 'express-validator/check';
import mongoose from 'mongoose'; // Temporary

/**
 * Local import
 */
// Models
import Product from '../models/product';

/**
 * Code
 */
const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  const errors = validationResult(req);
  // If there is errors, set status code 422 and re-render the page
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      item: { title, imageUrl, description, price },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    // Faking an error in order to test
    _id: mongoose.Types.ObjectId('5cd033a8128aa827f6bb1497'),
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
    .catch(err => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   errorMessage: 'Database operation failed, please try again',
      //   item: { title, imageUrl, description, price },
      //   validationErrors: [],
      // });
      res.redirect('/500');
    });
};

const getProducts = (req, res, next) => {
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
    .catch(err => console.error(err));
};

const getEditProduct = (req, res, next) => {
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
    .catch(err => console.error(err));
};

const postEditProduct = (req, res, next) => {
  const { title, price, description, imageUrl, productId } = req.body;
  const { _id: currentUserId } = req.user;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      item: { title, imageUrl, description, price, _id: productId },
      validationErrors: errors.array(),
    });
  }

  return Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== currentUserId.toString()) {
        return res.redirect('/');
      }

      const updatedProduct = product;
      updatedProduct.title = title;
      updatedProduct.price = price;
      updatedProduct.description = description;
      updatedProduct.imageUrl = imageUrl;

      return updatedProduct
        .save()
        .then(response => {
          console.log('Product updated');
          res.redirect('/admin/products');
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  const { _id: currentUserId } = req.user;

  Product.deleteOne({ _id: productId, userId: currentUserId })
    .then(response => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
};

/**
 * Export
 */
export {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
