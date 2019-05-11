/**
 * NPM import
 */
import express from 'express';
import { check } from 'express-validator/check';

/**
 * Local import
 */
// Controllers middleware functions
import {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
  postLogout,
} from '../controllers/auth';

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    // eslint-disable-next-line no-unused-vars
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('This email address is forbidden !');
      }
      // Important to return true after the condition
      return true;
    }),
  postSignup
);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

router.get('/reset-password/:token', getNewPassword);

router.post('/new-password', postNewPassword);

router.post('/logout', postLogout);

/**
 * Export
 */
export default router;
