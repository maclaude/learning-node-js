/**
 * NPM import
 */
const Sequelize = require('sequelize');

/**
 * Local import
 */
// Database connection
const sequelize = require('../utils/database');

/**
 * Code
 */
const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

/**
 * Export
 */
module.exports = CartItem;
