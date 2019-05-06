// Shop Controller

/**
 * Local import
 */
// Models
import Product from '../models/product';

/**
 * Code
 */
const getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        items: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => console.error(err));
};

const getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        items: products,
        pageTitle: 'Products',
        path: '/products',
      });
    })
    .catch(err => console.error(err));
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        item: product,
      });
    })
    .catch(err => console.error(err));
};

const getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId') // To get the data of the relation
    .execPopulate() // In order to get a promise
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products,
      });
    })
    .catch(err => console.error(err));
};

const postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => console.error(err));
};

const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .deleteCartItem(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.error(err));
};

const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(err => console.error(err));
};

const postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.error(err));
};

/**
 * Export
 */
export {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  postOrder,
};
