// Shop Controller

/**
 * Local import
 */
// Models
import Product from '../models/product';
import Order from '../models/order';

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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
        item: product,
      });
    })
    .catch(err => console.error(err));
};

const getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId') // To get the data of the relation
    .execPopulate() // In order to get a promise
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        isAuthenticated: req.session.isLoggedIn,
        products,
      });
    })
    .catch(err => console.error(err));
};

const postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => console.error(err));
};

const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.session.user
    .deleteCartItem(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.error(err));
};

const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        isAuthenticated: req.session.isLoggedIn,
        orders,
      });
    })
    .catch(err => console.error(err));
};

const postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        // eslint-disable-next-line no-underscore-dangle
        return { product: { ...item.productId._doc }, quantity: item.quantity };
      });

      const order = new Order({
        products,
        user: {
          name: req.session.user.name,
          userId: req.session.user,
        },
      });

      return order.save();
    })
    .then(result => req.session.user.clearCart())
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
