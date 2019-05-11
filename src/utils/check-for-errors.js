/**
 * Code
 */
const checkForErrors = req => {
  let message = req.flash('error');
  message.length > 0 ? (message = message[0]) : (message = null);
  return message;
};

/**
 * Export
 */
export default checkForErrors;
