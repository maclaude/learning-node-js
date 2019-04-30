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
const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

/**
 * Export
 */
module.exports = Order;
