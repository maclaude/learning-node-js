// Error Controller

/**
 * Code
 */
exports.get404 = (req, res, next) => {
  res.status(404).render('error/404', {
    pageTitle: 'Page not Found',
    path: '/404',
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('error/500', {
    pageTitle: 'Error occured',
    path: '/500',
  });
};
