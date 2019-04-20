/**
 * Require Node JS Core Modules
 */
// File system
const fs = require('fs');

/**
 * Code
 */
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    // HTML code
    res.write('<html>');
    res.write('<head><title>Enter message</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');

    // End of the response
    return res.end();
  }
  
  if (url === '/message' && method === 'POST') {
    const body = [];
  
    // Chunks (Streams & Buffers) received & stocked
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk);
    });
  
    return req.on('end', () => {
    // Chunks assembled and converted to string
    const parsedBody = Buffer.concat(body).toString();
    // Get the value of the message
    const message = parsedBody.split('=')[0];
    
      // message writted into the file
      fs.writeFile('message.txt', message, (err) => {
        // Set response status code & header
        res.statusCode = 302;
        res.setHeader('Location', '/');

        // End of the response
        return res.end();
      });
    });
  }
  
  // Set response header
  res.setHeader('Content-Type', 'text/html');
  // HTML code
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello from my node.js Server!</h1></body>');
  res.write('</html>');
  // End of the response (No code should be write after)
  res.end();
};

/**
 * Export
 */
module.exports = requestHandler;
