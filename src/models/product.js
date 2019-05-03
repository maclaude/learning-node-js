/**
 * NPM import
 */
// MongoDB
const mongodb = require('mongodb');

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

  static findById(productId) {
    const db = getDatabase();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => console.log(err));
  }
}

/**
 * Export
 */
module.exports = Product;
