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
  // Storing user in session
  User.findById('5cd029b66b5435204cdeb87c')
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // Saving the session then redirect
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
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
      return bcrypt.hash(password, 12);
    })
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
