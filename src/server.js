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

/**
 * Local import
 */
// Database
import { mongoConnect } from './utils/database';
// Models
import User from './models/user';
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

// Store the user in request
app.use((req, res, next) => {
  User.findById('5ccc41a3a6c9ea06c8c15589')
    .then(user => {
      const { username, email, _id, cart } = user;
      req.user = new User(username, email, _id, cart);
      next();
    })
    .catch(err => console.error(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error Page
app.use(getNotFound);

/**
 * MongoDB
 */
mongoConnect(() => {
  // Start the server
  app.listen(3000);
});
