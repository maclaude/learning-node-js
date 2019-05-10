// Auth Controller

/**
 * NPM import
 */
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

/**
 * Local import
 */
// Models
import User from '../models/user';

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
  let message = req.flash('error');
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
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
  let message = req.flash('error');
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message,
  });
};

const postSignup = (req, res, next) => {
  const { name, email, password } = req.body;

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
  let message = req.flash('error');
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMessage: message,
  });
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
  postLogout,
};
