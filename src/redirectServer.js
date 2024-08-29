const http = require('http');

/**
 * Creates an HTTP server that redirects all incoming requests to HTTPS.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The outgoing HTTP response object.
 */
const httpServer = http.createServer((req, res) => {
    // Send a 301 Moved Permanently response with the new location (HTTPS URL)
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end(); // End the response
});

// Start the HTTP server on port 80
httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80 (redirects to HTTPS)');
});