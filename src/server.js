/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Node Core Modules import
 */
import path from 'path';

/**
 * NPM import
 */
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

/**
 * Local import
 */
// Models
// import User from './models/user';
// Controllers middleware functions
import getNotFound from './controllers/errors';
// Routes
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';

/**
 * Code
 */
// Environment variables
dotenv.config();

// Init express
const app = express();

// Set view engine configuration
app.set('view engine', 'ejs');
// Set views directory path
app.set('views', 'src/views');

/**
 * Middlewares
 */
// Parser (Parsing the incoming request body)
// ! This middleware should always be placed first
app.use(bodyParser.urlencoded({ extended: true }));

// Access to the public directory path
app.use(express.static(path.join(__dirname, 'public')));

// // Store the user in request
// app.use((req, res, next) => {
//   User.findById('5ccc41a3a6c9ea06c8c15589')
//     .then(user => {
//       const { username, email, _id, cart } = user;
//       req.user = new User(username, email, _id, cart);
//       next();
//     })
//     .catch(err => console.error(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error Page
app.use(getNotFound);

/**
 * Database connexion with Mongoose
 */
// Database password
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://maclaude:${dbPassword}@node-js-qfuuy.mongodb.net/shop?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log('Connected');
    // Start the server
    app.listen(3000);
  })
  .catch(err => console.error(err));
