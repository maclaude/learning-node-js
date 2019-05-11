/* eslint-disable no-unused-vars */
/**
 * NPM import
 */
import { check } from 'express-validator/check';

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
];

// Export
export default signupValidation;
