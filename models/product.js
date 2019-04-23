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
// Helper function
const filePath = path.join(
  path.dirname(process.mainModule.filename),
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

// Class
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
