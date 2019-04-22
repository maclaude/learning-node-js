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
const expressHandlebars = require('express-handlebars');

/**
 * Local import
 */
// Routes
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/**
 * Code
 */
const app = express();

// Initialise express-handlebars view engine
app.engine(
  'hbs',
  expressHandlebars({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs',
  }),
);

// Set view engine configuration
app.set('view engine', 'hbs');
// Set views directory path
app.set('views', 'views');

/**
 * Middlewares
 */
// Parser (Parsing the incoming request body)
// ! This middleware should always be placed first
app.use(bodyParser.urlencoded({ extended: true }));

// Access to the public directory path
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// 404 Error Page
app.use((req, res, next) => {
  res.status(404).render('not-found', { pageTitle: 'Page not Found' });
});

/**
 * Server
 */
app.listen(3000);
