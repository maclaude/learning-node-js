/* eslint-disable no-console */
/**
 * NPM import
 */
const express = require('express');
const bodyParser = require('body-parser');

/**
 * Local import
 */
// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/**
 * Code
 */
const app = express();

/**
 * Middlewares
 */
// Parser (Parsing the incoming request body)
// ! This middleware should always be placed first
app.use(bodyParser.urlencoded({ extended: true }));

app.use(adminRoutes);
app.use(shopRoutes);

/**
 * Server
 */
app.listen(3000);
