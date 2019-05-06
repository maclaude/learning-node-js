// Admin Controller

/**
 * Local import
 */
// Models
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
  const { title, imageUrl, description, price } = req.body;

  const { _id } = req.user;

  const product = new Product(title, price, imageUrl, description, null, _id);

  product
    .save()
    .then(result => {
      console.log('Product created');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/product-list', {
        items: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  // Adding a query parameter (optionnal)
  const editMode = req.query.edit;

  if (!editMode) {
    res.redirect('/');
  } else {
    const { productId } = req.params;

    Product.findById(productId)
      .then(product => {
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
  const { title, price, imageUrl, description, productId } = req.body;

  const product = new Product(title, price, imageUrl, description, productId);

  product
    .save()
    .then(result => {
      console.log('product updated');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(result => {
      console.log('product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
