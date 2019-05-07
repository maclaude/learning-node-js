// Auth Controller

/**
 * Code
 */
const getLogin = (req, res, next) => {
  const isLoggedIn = req.cookies.loggedIn;

  console.log(isLoggedIn);

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};

/**
 * Export
 */
export { getLogin, postLogin };
