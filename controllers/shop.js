// Shop Controller

/**
 * Node Core Module import
 */
const fs = require('fs');
const path = require('path');

/**
 * NPM import
 */
const dotenv = require('dotenv');
const PDFDocument = require('pdfkit');

/**
 * Local import
 */
// Models
const Product = require('../models/product');
const Order = require('../models/order');
// Utils
const errorHandler = require('../utils/error-handler');

/**
 * Code
 */
// Environment variables
dotenv.config();

const ITEMS_PER_PAGE = 4;

exports.getIndex = (req, res, next) => {
  const { page } = req.query;
  // if page is undefined set value to 1
  const currentPage = parseInt(page, 10) || 1;

  let totalProducts;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalProducts = numProducts;
      return (
        Product.find()
          // Skipping products of previous pages
          .skip((page - 1) * ITEMS_PER_PAGE)
          // Limit of products we want to retrieve
          .limit(ITEMS_PER_PAGE)
      );
    })
    .then(products => {
      res.render('shop/index', {
        items: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage,
        hasPreviousPage: currentPage > 1,
        hasNextPage: ITEMS_PER_PAGE * currentPage < totalProducts,
        previousPage: currentPage - 1,
        nextPage: currentPage + 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch(errorHandler(next));
};

exports.getProducts = (req, res, next) => {
  const { page } = req.query;
  const currentPage = parseInt(page, 10) || 1;

  let totalProducts;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        items: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage,
        hasPreviousPage: currentPage > 1,
        hasNextPage: ITEMS_PER_PAGE * currentPage < totalProducts,
        previousPage: currentPage - 1,
        nextPage: currentPage + 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch(errorHandler(next));
};

exports.getProduct = (req, res, next) => {
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

exports.getCart = (req, res, next) => {
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

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(response => res.redirect('/cart'))
    .catch(errorHandler(next));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .deleteCartItem(productId)
    .then(response => res.redirect('/cart'))
    .catch(errorHandler(next));
};

exports.getOrders = (req, res, next) => {
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

exports.postOrder = (req, res, next) => {
  // Require & init strip with API KEY
  // eslint-disable-next-line global-require
  const stripe = require('stripe')(process.env.STRIPE_API_KEY);
  // Getting the stripe token
  const token = req.body.stripeToken;
  // Initialize total cart value
  let totalSum = 0;

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      // Setting cart total value
      totalSum = user.cart.items.reduce(
        (total, product) => total + product.quantity * product.productId.price,
        0
      );
      // Getting user cart products
      const products = user.cart.items.map(item => {
        return { product: { ...item.productId._doc }, quantity: item.quantity };
      });
      // Creating the order
      const order = new Order({
        products,
        user: {
          name: req.user.name,
          userId: req.user,
        },
      });
      // Saving the order
      return order.save();
    })
    .then(response => {
      // Stripe charging the user
      stripe.charges.create({
        amount: totalSum * 100,
        currency: 'usd',
        description: 'Shop test order',
        source: token,
        metadata: { order_id: response._id.toString() },
      });
      req.user.clearCart();
    })
    .then(response => res.redirect('/orders'))
    .catch(errorHandler(next));
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  // Finding the order in the database
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      // If current user doesn't match with the order's user, send an error
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      // Setting invoice name
      const invoiceName = `invoice-${orderId}.pdf`;
      // Setting invoice path
      const invoicePath = path.join('src', 'data', 'invoices', invoiceName);
      // Create a new PDF document
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      // inline: open in the browser - attachment: download
      res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
      // Saving the doc into the invoices folder
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // Return the file to the client
      pdfDoc.pipe(res);
      // Adding content to the document
      pdfDoc.fontSize(20).text('Invoice', {
        underline: true,
      });
      // Initating the total price
      let totalPrice = 0;
      order.products.forEach(prod => {
        // Updating the total price
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} x ${prod.product.price} $`
          );
      });
      pdfDoc.fontSize(16).text(`Total: ${totalPrice} $`);
      // Ending document edition
      return pdfDoc.end();
    })
    .catch(err => next(err));
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate('cart.items.productId') // To get the data of the relation
    .execPopulate() // In order to get a promise
    .then(user => {
      const products = user.cart.items;
      const totalSum = products.reduce(
        (total, product) => total + product.quantity * product.productId.price,
        0
      );
      res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        products,
        totalSum,
      });
    })
    .catch(errorHandler(next));
};
