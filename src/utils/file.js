/**
 * Node Core Module import
 */
import fs from 'fs';

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
export default deleteFile;
