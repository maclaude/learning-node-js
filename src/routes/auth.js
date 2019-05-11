/**
 * NPM import
 */
import express from 'express';

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
// Utils
import signupValidation from '../utils/signup-validation';

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

router.post('/signup', signupValidation, postSignup);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

router.get('/reset-password/:token', getNewPassword);

router.post('/new-password', postNewPassword);

router.post('/logout', postLogout);

/**
 * Export
 */
export default router;
