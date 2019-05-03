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
// Extraction of the MongoDB ObjectId constructor
const { ObjectId } = mongodb;

class User {
  constructor(username, email, id, cart) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDatabase();

    return db
      .collection('users')
      .insertOne(this)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const { _id } = product;

    const updatedCart = {
      items: [{ productId: new ObjectId(_id), quantity: 1 }],
    };
    const db = getDatabase();

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const db = getDatabase();
    return db
      .collection('users')
      .find({ _id: new ObjectId(userId) })
      .next()
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

/**
 * Export
 */
module.exports = User;
