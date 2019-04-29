/**
 * NPM import
 */
const Sequelize = require('sequelize');

/**
 * Connection
 */
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost',
  },
);

/**
* Export
*/
module.exports = sequelize;
