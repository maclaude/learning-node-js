/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
/**
 * NPM import
 */
const { check, body } = require('express-validator/check');

/**
 * Local import
 */
const User = require('../models/user');

/**
 * Code
 */
exports.signupValidation = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject(
            'E-mail exists already, please choose a different one '
          );
        }
        return true;
      });
    }),
  body('password', 'Please enter a password with at least 8 characters')
    .isLength({ min: 8 })
    .trim(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirmed password aren't the same");
      }
      return true;
    }),
];

exports.loginValidation = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password', 'Please enter a password with at least 8 characters')
    .isLength({ min: 8 })
    .trim(),
];
