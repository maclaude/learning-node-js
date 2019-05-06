/**
 * NPM import
 */
import mongoose from 'mongoose';

/**
 * Code
 */
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// methods key is an oject that allows you to add your own methods
// Use classic function in order that this refers to the Schema
userSchema.methods.addToCart = function addToCart(product) {
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
      productId: _id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  // Update the cart
  return this.save();
};

/**
 * Export
 */
export default mongoose.model('User', userSchema);

// /**
//  * NPM import
//  */
// // MongoDB
// import mongodb from 'mongodb';

// /**
//  * Local import
//  */
// // Database access
// import { getDatabase } from '../utils/database';

// /**
//  * Code
//  */
// // Extraction of the MongoDB ObjectId constructor
// const { ObjectId } = mongodb;

// class User {
//   constructor(username, email, id, cart) {
//     this.username = username;
//     this.email = email;
//     this._id = id;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDatabase();

//     return db
//       .collection('users')
//       .insertOne(this)
//       .then(result => console.log(result))
//       .catch(err => console.error(err));
//   }

//   getCart() {
//     const db = getDatabase();

//     const productIds = this.cart.items.map(item => {
//       return item.productId;
//     });

//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(item => {
//               const { _id } = product;
//               return item.productId.toString() === _id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch();
//   }

//   addToCart(product) {
//     const { _id } = product;

//     // Finding if the product is already in the cart
//     const cartProductIndex = this.cart.items.findIndex(item => {
//       return item.productId.toString() === _id.toString();
//     });
//     // Init quantity
//     let newQuantity = 1;
//     // Copying the cart
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       // Incrementing the quantity
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // Add product to the cart
//       updatedCartItems.push({
//         productId: new ObjectId(_id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDatabase();

//     // Update the cart
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   deleteCartItem(productId) {
//     // Deleting the product
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDatabase();

//     // Update the cart
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDatabase();

//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//           },
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         // Update the user cart
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDatabase();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDatabase();
//     return db
//       .collection('users')
//       .find({ _id: new ObjectId(userId) })
//       .next()
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => console.error(err));
//   }
// }

// /**
//  * Export
//  */
// export default User;
