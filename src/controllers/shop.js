// Shop Controller
/**
 * Node Core Module import
 */
import fs from 'fs';
import path from 'path';

/**
 * Local import
 */
// Models
import Product from '../models/product';
import Order from '../models/order';
// Utils
import errorHandler from '../utils/error-handler';

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
    .catch(errorHandler(next));
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
    .catch(errorHandler(next));
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
    .catch(errorHandler(next));
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
    .catch(errorHandler(next));
};

const postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(response => res.redirect('/cart'))
    .catch(errorHandler(next));
};

const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .deleteCartItem(productId)
    .then(response => res.redirect('/cart'))
    .catch(errorHandler(next));
};

const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(errorHandler(next));
};

const postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return { product: { ...item.productId._doc }, quantity: item.quantity };
      });

      const order = new Order({
        products,
        user: {
          name: req.user.name,
          userId: req.user,
        },
      });

      return order.save();
    })
    .then(response => req.user.clearCart())
    .then(response => res.redirect('/orders'))
    .catch(errorHandler(next));
};

const getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('src', 'data', 'invoices', invoiceName);

  fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.send(data);
  });
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
  getInvoice,
};
