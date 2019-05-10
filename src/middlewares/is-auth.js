// Checking authentication middleware

/**
 * Code
 */
const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
  } else {
    next();
  }
};

/**
 * Export
 */
export default isAuth;
