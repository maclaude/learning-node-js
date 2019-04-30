// Errors Controller

/**
 * Code
 */
exports.getNotFound = (req, res, next) => {
  res.status(404).render('not-found', {
    pageTitle: 'Page not Found',
    path: '/not-found',
  });
};
