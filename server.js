/* eslint-disable no-console */
/**
 * NPM import
 */
const express = require('express');
const bodyParser = require('body-parser');

/**
 * Code
 */
const app = express();

/**
 * Middleware
 */
// Parser (Parsing the incoming request body)
// ! This middleware should always be placed first
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', (req, res, next) => {
  console.log('This always runs !');
  next();
});

app.use('/add-product', (req, res, next) => {
  console.log('Add Product middleware');
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.use('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello from Express !</h1>');
});

/**
 * Server
 */
app.listen(3000);
