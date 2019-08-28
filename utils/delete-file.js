/**
 * Node Core Module import
 */
const fs = require('fs');

/**
 * Code
 */
const deleteFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      throw err;
    }
  });
};

/**
 * Export
 */
module.exports = deleteFile;
