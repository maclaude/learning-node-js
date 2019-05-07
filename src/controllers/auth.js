// Auth Controller

/**
 * Code
 */
const getLogin = (req, res, next) => {
  // const isLoggedIn = req.cookies.loggedIn;

  console.log(req.session.isLoggedIn);

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
