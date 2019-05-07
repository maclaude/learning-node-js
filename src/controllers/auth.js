// Auth Controller

/**
 * Code
 */
const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

const postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};

/**
 * Export
 */
export { getLogin, postLogin };
