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
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const filePath = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'products.json',
    );

    fs.readFile(filePath, (err, fileContent) => {
      let products = [];

      if (!err) {
        products = JSON.parse(fileContent);
      }

      products.push(this);

      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    const filePath = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'products.json',
    );

    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        callback([]);
      }
      callback(JSON.parse(fileContent));
    });
  }
};
