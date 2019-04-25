/* eslint-disable no-shadow */
/* eslint-disable no-console */
// Product Model

/**
 * Local import
 */
// Database
const db = require('../utils/database');
// Models
// const Cart = require('./cart');

/**
 * Code
 */
class Product {
  /*
   * Constructor
   */
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  /**
   * Save
   */
  save() {
    console.log(this);
  }

  static deleteById(id) {
    console.log(id);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM `products`');
  }

  static findById(id) {
    console.log(id);
  }
}

/**
 * Export
 */
module.exports = Product;
