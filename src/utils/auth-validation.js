/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
/**
 * NPM import
 */
import { check, body } from 'express-validator/check';

/**
 * Local import
 */
import User from '../models/user';

/**
 * Code
 */
const signupValidation = [
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

const loginValidation = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password', 'Please enter a password with at least 8 characters')
    .isLength({ min: 8 })
    .trim(),
];

/**
 * Export
 */
export { signupValidation, loginValidation };
