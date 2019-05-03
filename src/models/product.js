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
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDatabase();
    let dbOp;

    if (this._id) {
      // Update the product
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Create the product
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
      .then(result => console.log(result))
      .catch(err => console.log(err));
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

  static deleteById(productId) {
    const db = getDatabase();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then(result => console.log('product deleted'))
      .catch(err => console.log(err));
  }
}

/**
 * Export
 */
module.exports = Product;
