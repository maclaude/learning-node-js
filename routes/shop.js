/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * NPM import
 */
const express = require('express');

/**
 * Code
 */
const router = express.Router();

// Middlewares
router.get('/', (req, res, next) => {
  res.send('<h1>Hello from Express !</h1>');
});

/**
 * Export
 */
module.exports = router;
