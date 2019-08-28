// Auth Controller

/**
 * Node Core Modules import
 */
const crypto = require('crypto');

/**
 * NPM import
 */
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

/**
 * Local import
 */
// Models
const User = require('../models/user');
// Utils
const checkForErrors = require('../utils/check-for-errors');
const errorHandler = require('../utils/error-handler');

/**
 * Code
 */
// Environment variables
dotenv.config();

// Intialize send-grid transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

// Middleware functions
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: checkForErrors(req),
    oldInputs: { email: '', password: '' },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  // If there is errors, set status code 422 and re-render the page
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInputs: { email, password },
      validationErrors: errors.array(),
    });
  }

  // Finding user by email
  return User.findOne({ email })
    .then(user => {
      if (!user) {
        // If there is no user, redirect to login
        return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          path: '/login',
          errorMessage: 'Invalid email or password',
          oldInputs: { email, password },
          validationErrors: [],
        });
      }
      return (
        bcrypt
          // Comparing passwords
          .compare(password, user.password)
          .then(passwordsdMatch => {
            // If passwords matched, storing user in session
            if (passwordsdMatch) {
              req.session.user = user;
              req.session.isLoggedIn = true;
              // Saving the session, then redirect to the homepage
              return req.session.save(err => res.redirect('/'));
            }
            // Otherwise re-render the login page
            return res.status(422).render('auth/login', {
              pageTitle: 'Login',
              path: '/login',
              errorMessage: 'Invalid email or password',
              oldInputs: { email, password },
              validationErrors: [],
            });
          })
          .catch(err => {
            console.error(err);
            res.redirect('/login');
          })
      );
    })
    .catch(errorHandler(next));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: checkForErrors(req),
    oldInputs: { name: '', email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const errors = validationResult(req);
  // If there is errors, set status code 422 and re-render the page
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInputs: { name, email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  // Encrypting password
  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return newUser.save();
    })
    .then(response => {
      res.redirect('/login');
      // Sending email
      return transporter.sendMail({
        to: email,
        from: 'shop@learning-node-js.com',
        subject: 'Signup succeded',
        html: `<h1>You are successfully signed up ${name}!</h1>`,
      });
    })
    .catch(errorHandler(next));
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: checkForErrors(req),
  });
};

exports.postResetPassword = (req, res, next) => {
  // Generating random bytes (token)
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    const { email } = req.body;

    // Finding the user with the email
    return User.findOne({ email })
      .then(user => {
        // Redirecting if no email founded in the user collection
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset-password');
        }
        const currentUser = user;
        // Setting the user reset token
        currentUser.resetToken = token;
        // Setting the user token expiration time of 1hour
        currentUser.resetTokenExpiration = Date.now() + 3600000;
        // Saving user update
        return currentUser.save();
      })
      .then(response => {
        // Redirecting to homepage
        res.redirect('/');
        // Sending email to the user with the reset-password link
        transporter.sendMail({
          to: email,
          from: 'shop@learning-node-js.com',
          subject: 'Reset you password',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch(errorHandler(next));
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  // Finding the user by token & checking the token validity (expiration date)
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      const { _id } = user;
      // Rendering the view with the userId in order to post new password
      res.render('auth/new-password', {
        pageTitle: 'Update Password',
        path: '/new-password',
        errorMessage: checkForErrors(req),
        userId: _id.toString(),
        passwordToken: token,
      });
    })
    .catch(errorHandler(next));
};

exports.postNewPassword = (req, res, next) => {
  const { newPassword, userId, passwordToken } = req.body;
  let resetUser;
  // Finding the user by id & token and checking the token validity (expiration date)
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(user => {
      resetUser = user;
      // Encrypting password
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      // Setting user new password
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      // Saving updated user
      return resetUser.save();
    })
    .then(response => res.redirect('/login'))
    .catch(errorHandler(next));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => res.redirect('/'));
};
