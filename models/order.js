/**
 * NPM import
 */
const mongoose = require('mongoose');

/**
 * Code
 */
const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
});

/**
 * Export
 */
module.exports = mongoose.model('Order', orderSchema);
