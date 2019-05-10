// Auth Controller

/**
 * NPM import
 */
import bcrypt from 'bcryptjs';

/**
 * Local import
 */
// Models
import User from '../models/user';

/**
 * Code
 */
const getLogin = (req, res, next) => {
  // Checking if user is logged in
  let isLoggedIn = false;
  if (req.user) {
    isLoggedIn = true;
  }

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // Finding user by email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // If there is no user, redirect to login
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
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
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
        });
    })
    .catch(err => console.log(err));
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
export { getLogin, postLogin, getSignup, postSignup, postLogout };
