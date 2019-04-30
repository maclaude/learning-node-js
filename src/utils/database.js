/**
 * NPM import
 */
const mongodb = require('mongodb');

/**
 * Connexion
 */
const { MongoClient } = mongodb;

const mongoConnect = callback => {
  // Database password
  const dbPassword = process.env.DB_PASSWORD;

  // Connexion to the database
  MongoClient.connect(
    `mongodb+srv://maclaude:${dbPassword}@node-js-qfuuy.mongodb.net/test?retryWrites=true`
  )
    .then(client => {
      console.log('Connected');
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Export
 */
module.exports = mongoConnect;
