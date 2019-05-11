// Admin Controller

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
  });
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then(result => {
      console.log('Product created');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.error(err);
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
      .catch(err => console.error(err));
  }
};

const postEditProduct = (req, res, next) => {
  const { title, price, description, imageUrl, productId } = req.body;
  const { _id: currentUserId } = req.user;

  Product.findById(productId)
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
        .then(result => {
          console.log('product updated');
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
    .then(result => {
      console.log('product deleted');
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
