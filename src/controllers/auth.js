// Auth Controller

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

const postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

/**
 * Export
 */
export { getLogin, postLogin, postLogout };
