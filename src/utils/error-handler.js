/**
 * Code
 */
const errorHandler = next => err => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  // When calling next() with an argument, it will go directly to the error handling middleware
  return next(error);
};

/**
 * Export
 */
export default errorHandler;
