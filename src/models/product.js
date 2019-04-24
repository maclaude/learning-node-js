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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // Generate an ID for demo purpose
    // @TODO: replace with an NPM package (uuid)
    this.id = Math.random().toString();

    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(
        filePath,
        JSON.stringify(products),
        err => console.log(err),
      );
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
