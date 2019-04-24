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

// Access to the assets directory path
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error Page
app.use(errorsController.getNotFound);

/**
 * Server
 */
app.listen(3000);