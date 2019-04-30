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
const sequelize = require('./utils/database');
// Models
const Product = require('./models/product');
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

// Adding a user to a the request
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error Page
app.use(errorsController.getNotFound);

/**
 * Sequelize
 */
// Models association
Product.belongsTo(User, { constaints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// Sync models to the database
sequelize
  .sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    // Create a user if not exisiting
    if (!user) {
      return User.create({
        name: 'Marc-Antoine',
        email: 'claude.marcantoine2@gmail.com',
      });
    }
    return user;
  })
  .then((user) => {
    console.log(user);
    // Start the server
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
