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
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl],
    );
  }

  static deleteById(id) {
    console.log(id);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
}

/**
 * Export
 */
module.exports = Product;
