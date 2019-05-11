/* eslint-disable no-unused-vars */
/**
 * NPM import
 */
import { check, body } from 'express-validator/check';

/**
 * Code
 */
const signupValidation = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('This email address is forbidden !');
      }
      // Important to return true after the condition
      return true;
    }),
  body(
    'password',
    'Please enter a password with at least 8 characters'
  ).isLength({ min: 8 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords are not the same');
    }
    return true;
  }),
];

// Export
export default signupValidation;
