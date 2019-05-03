/**
 * Local import
 */
// Database access
const { getDatabase } = require('../utils/database');

/**
 * Code
 */
class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

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

  static fetchAll() {
    const db = getDatabase();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => console.log(err));
  }
}

/**
 * Export
 */
module.exports = Product;
