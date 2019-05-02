/**
 * NPM import
 */
const mongodb = require('mongodb');

/**
 * Connexion
 */
const { MongoClient } = mongodb;

let database;

const mongoConnect = callback => {
  // Database password
  const dbPassword = process.env.DB_PASSWORD;

  // Connexion to the database
  MongoClient.connect(
    `mongodb+srv://maclaude:${dbPassword}@node-js-qfuuy.mongodb.net/shop?retryWrites=true`,
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log('Connected');
      // Access to the database shop
      database = client.db();
      callback(client);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// Retrieve the database
const getDatabase = () => {
  if (database) {
    return database;
  }
  return console.error('No database connection');
};

/**
 * Export
 */
exports.mongoConnect = mongoConnect;
exports.getDatabase = getDatabase;
