/**
 * Require Node JS Core Modules
 */
// http
const http = require('http');

/**
 * Local import
 */
const routes = require('./routes');

/**
 * Code
 */
// Server creation
const server = http.createServer(routes);

// Server listening requests on port 3000
server.listen(3000);