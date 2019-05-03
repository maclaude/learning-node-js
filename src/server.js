/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Node Core Modules import
 */
const path = require('path');
/**
 * NPM import
 */
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

/**
 * Local import
 */
// Environment variables
dotenv.config();
// Database
const { mongoConnect } = require('./utils/database');
// Models
const User = require('./models/user');
// Controllers
const errorsController = require('./controllers/errors');
// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/**
 * Code
 */
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

// Store a user in a request
app.user((req, res, next) => {
  User.findById('5ccc41a3a6c9ea06c8c15589')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error Page
app.use(errorsController.getNotFound);

/**
 * MongoDB
 */
mongoConnect(() => {
  // Start the server
  app.listen(3000);
});
