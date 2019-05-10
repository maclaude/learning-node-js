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

router.post('/signup', postSignup);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

router.post('/logout', postLogout);

/**
 * Export
 */
export default router;
