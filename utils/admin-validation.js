/**
 * NPM import
 */
const { body } = require('express-validator/check');

/**
 * Code
 */
const productFormValidation = [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price').isFloat(),
  body('description')
    .isLength({ min: 5, max: 400 })
    .trim(),
];

/**
 * Export
 */
module.exports = productFormValidation;
