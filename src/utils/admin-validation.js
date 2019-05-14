/**
 * NPM import
 */
import { body } from 'express-validator/check';

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
export default productFormValidation;
