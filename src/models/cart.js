/* eslint-disable no-shadow */
/* eslint-disable no-console */
// Cart Model

/**
 * Node Core Modules import
 */
const fs = require('fs');
const path = require('path');

/**
 * Code
 */
// Root directory
const rootDirectory = path.dirname(process.mainModule.filename);

// cart.json data file path
const filePath = path.join(
  rootDirectory,
  'data',
  'cart.json',
);

// Class
class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      // Init the cart with starting values
      let cart = { products: [], totalPrice: 0 };
      // If no error means there is an exisiting cart which is assigned to cart
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Analyze the cart and find existing product
      const productIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[productIndex];

      let updatedProduct;

      // Exsiting product => Increase quantity
      // Else => Add new product

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        // Update cart products
        cart.products[productIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        // Update cart products
        cart.products = [...cart.products, updatedProduct];
      }

      // Update the total price
      cart.totalPrice += productPrice;

      // Write to file
      fs.writeFile(
        filePath,
        JSON.stringify(cart),
        err => console.log(err),
      );
    });
  }
}

/**
 * Export
 */
module.exports = Cart;
