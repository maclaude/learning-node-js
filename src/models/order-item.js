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
const OrderItem = sequelize.define('orderItem', {
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
module.exports = OrderItem;
