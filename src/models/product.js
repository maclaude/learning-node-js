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
  save() {
    const db = getDatabase();
    return db
      .collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

/**
 * Export
 */
module.exports = Product;
