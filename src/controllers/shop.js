// Shop Controller
/**
 * Node Core Module import
 */
import fs from 'fs';
import path from 'path';

/**
 * Node import
 */
import PDFDocument from 'pdfkit';

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
  // finding the order in the database
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
      pdfDoc.end();
    })
    .catch(err => next(err));
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
