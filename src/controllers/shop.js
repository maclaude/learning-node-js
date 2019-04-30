// Products Controller

/**
 * Local import
 */
// Models
const Product = require('../models/product');

/**
 * Code
 */
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        items: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        items: products,
        pageTitle: 'Products',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        item: product,
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products,
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;

      if (products.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        product = products[0];
      }

      if (product) {
        const { quantity } = product.cartItem;
        newQuantity = quantity + 1;
        return product;
      }

      return Product.findByPk(productId);
    })
    .then(product =>
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      })
    )
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: productId } }))
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              const updatedProduct = product;
              updatedProduct.orderItem = {
                quantity: product.cartItem.quantity,
              };
              return updatedProduct;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};
