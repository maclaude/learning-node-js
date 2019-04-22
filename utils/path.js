/**
 * Node Core Modules import
 */
const path = require('path');

/**
 * Export
 */
// mainModule = Module where we start our application `app.js`
module.exports = path.dirname(process.mainModule.filename);
