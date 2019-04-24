/* eslint-disable no-shadow */
/* eslint-disable no-console */
// Product Model

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

// products.json data file path
const filePath = path.join(
  rootDirectory,
  'data',
  'products.json',
);

const getProductsFromFile = (callback) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};


class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // if id => edit => finding the existing product index in products
        const existingProductIndex = products.findIndex(
          product => product.id === this.id,
        );
        // Copy of products array
        const updatedProducts = [...products];
        // Update of the exsisting product
        updatedProducts[existingProductIndex] = this;
        // Write to file
        fs.writeFile(
          filePath,
          JSON.stringify(updatedProducts),
          err => console.log(err),
        );
      } else {
        // Generate an ID for demo purpose
        // @TODO: replace with an NPM package (uuid)
        this.id = Math.random().toString();
        // Add new product to products array
        products.push(this);
        // Write to file
        fs.writeFile(
          filePath,
          JSON.stringify(products),
          err => console.log(err),
        );
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find(product => product.id === id);
      callback(product);
    });
  }
}

/**
 * Export
 */
module.exports = Product;
