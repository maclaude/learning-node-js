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
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(
            'E-mail exists already, please choose a different one '
          );
        }
        return true;
      });
    }),
  body(
    'password',
    'Please enter a password with at least 8 characters'
  ).isLength({ min: 8 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirmed password aren't the same");
    }
    return true;
  }),
];

// Export
export default signupValidation;
