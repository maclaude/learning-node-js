// Errors Controller

/**
 * Code
 */
const getNotFound = (req, res, next) => {
  res.status(404).render('not-found', {
    pageTitle: 'Page not Found',
    path: '/not-found',
    isAuthenticated: req.session.isLoggedIn,
  });
};

/**
 * Export
 */
export default getNotFound;
