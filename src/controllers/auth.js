// Auth Controller

/**
 * Node Core Modules import
 */
import crypto from 'crypto';

/**
 * NPM import
 */
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { validationResult } from 'express-validator/check';

/**
 * Local import
 */
// Models
import User from '../models/user';
// Utils
import checkForErrors from '../utils/check-for-errors';

/**
 * Code
 */
// Environment variables
dotenv.config();

// Intialize transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

// Middleware functions
const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: checkForErrors(req),
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // Finding user by email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // If there is no user, redirect to login
        req.flash('error', 'Invalid email or password');
        res.redirect('/login');
      } else {
        bcrypt
          // Comparing passwords
          .compare(password, user.password)
          .then(passwordsdMatch => {
            // If passwords matched, storing user in session
            if (passwordsdMatch) {
              req.session.user = user;
              req.session.isLoggedIn = true;
              // Saving the session, then redirect to the homepage
              return req.session.save(err => {
                console.error(err);
                res.redirect('/');
              });
            }
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
          })
          .catch(err => {
            console.error(err);
            res.redirect('/login');
          });
      }
    })
    .catch(err => console.error(err));
};

const getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: checkForErrors(req),
  });
};

const postSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  // If there is errors, set status code du 422 and re-render the page
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('error', 'Email address already exists');
        return res.redirect('signup');
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
        .then(result => {
          res.redirect('/login');
          // Sending email
          return transporter.sendMail({
            to: email,
            from: 'shop@learning-node-js.com',
            subject: 'Signup succeded',
            html: `<h1>You are successfully signed up ${name}!</h1>`,
          });
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

const getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: checkForErrors(req),
  });
};

const postResetPassword = (req, res, next) => {
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
      .then(result => {
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
      .catch(err => console.log(err));
  });
};

const getNewPassword = (req, res, next) => {
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
    .catch(err => console.error(err));
};

const postNewPassword = (req, res, next) => {
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
    .then(result => res.redirect('/login'))
    .catch(err => console.error(err));
};

const postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

/**
 * Export
 */
export {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
  postLogout,
};
