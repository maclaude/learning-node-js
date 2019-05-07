// Auth Controller

/**
 * Code
 */
const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};

/**
 * Export
 */
export { getLogin };
