/**
 * Require Node JS Core Modules
 */
// http
const http = require('http');

/**
 * NPM import
 */
const express = require('express');

/**
 * Code
 */
const app = express();

/**
 * Middleware
 */
app.use((req, res, next) => {
  console.log('In the middleware !');
  // Allow the request to continue to the next middleware in line;
  next();
});

app.use((req, res, next) => {
  console.log('In another middleware');
});

// Server creation
const server = http.createServer(app);

// Server listening requests on port 3000
server.listen(3000);
