/* eslint-disable no-unused-vars */
// Products Controller

/**
 * Code
 */
const products = [];

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
  products.push({
    title: req.body.title,
  });
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  res.render('shop',
    {
      items: products,
      pageTitle: 'My shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      // If not using the layout which is by default
      // layout: false,
    });
};
