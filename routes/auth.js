/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const authController = require('../controllers/auth');
// Utils
const {
  signupValidation,
  loginValidation,
} = require('../utils/auth-validation');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/login', authController.getLogin);

router.post('/login', loginValidation, authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', signupValidation, authController.postSignup);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.post('/logout', authController.postLogout);

/**
 * Export
 */
module.exports = router;
