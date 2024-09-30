const http = require('http');
const { logger } = require('./logger/logRotation');
/**
 * Creates an HTTP server that redirects all incoming requests to HTTPS.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The outgoing HTTP response object.
 */
// Create the HTTP server
const httpServer = http.createServer((req, res) => {
  // Extract the host from the request headers, removing any port information
  const host = req.headers.host.split(':')[0];
  // Get the URL path from the request
  const url = req.url;
  // Construct the redirect URL, changing the protocol to HTTPS and port to 8443
  const redirectUrl = `https://${host}:8443${url}`;

  // Log the redirection details
  logger.info(`Redirecting: ${url} -> ${redirectUrl}`);

  // Set the response header to perform a 301 permanent redirect
  res.writeHead(301, { Location: redirectUrl });
  res.end(); // End the response
});

// Start the HTTP server listening on port 80
httpServer.listen(80, () => {
  console.log(
    'HTTP Server running on port 80 (redirects to HTTPS on port 8443)'
  );
});
