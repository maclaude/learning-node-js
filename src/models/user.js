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
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

/**
 * Export
 */
module.exports = User;
