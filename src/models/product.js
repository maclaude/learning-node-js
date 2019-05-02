/**
 * Local import
 */
// Database access
const { getDatabase } = require('../utils/database');

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  // eslint-disable-next-line class-methods-use-this
  save() {}
}

/**
 * Export
 */
module.exports = Product;
