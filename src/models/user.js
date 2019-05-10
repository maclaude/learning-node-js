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
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
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

  this.cart.items = updatedCartItems;

  // Update the cart
  return this.save();
};

userSchema.methods.deleteCartItem = function deleteCartItem(productId) {
  // Deleting the product
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function clearCart() {
  this.cart = { items: [] };
  return this.save();
};

/**
 * Export
 */
export default mongoose.model('User', userSchema);
