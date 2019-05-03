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

  getCart() {
    const db = getDatabase();

    const productIds = this.cart.items.map(item => {
      return item.productId;
    });

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(item => {
              const { _id } = product;
              return item.productId.toString() === _id.toString();
            }).quantity,
          };
        });
      })
      .catch();
  }

  addToCart(product) {
    const { _id } = product;

    // Finding if the product is already in the cart
    const cartProductIndex = this.cart.items.findIndex(item => {
      return item.productId.toString() === _id.toString();
    });
    // Init quantity
    let newQuantity = 1;
    // Copying the cart
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      // Incrementing the quantity
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // Add product to the cart
      updatedCartItems.push({
        productId: new ObjectId(_id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDatabase();

    // Update the cart
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  deleteCartItem(productId) {
    // Deleting the product
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDatabase();

    // Update the cart
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
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
