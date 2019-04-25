/**
 * NPM import
 */
const mysql = require('mysql2');

/**
 * Connection
 */
// Connection pools help reduce the time spent connecting to the MySQL server
// by reusing a previous connection, leaving them open
// instead of closing when you are done with them.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

/**
 * Export
 */
// Promise in order to get then & catch
module.exports = pool.promise();
