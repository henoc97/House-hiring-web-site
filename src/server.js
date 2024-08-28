// server.js

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const apicache = require('apicache');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const { root } = require('./endpoint');

// Create Express application and HTTP server
const app = express();
const server = http.createServer(app);

// Import and configure WebSocket server
const configureWebSocket = require('./websocketServer');
configureWebSocket(server);

// Configure EJS template engine
app.set('view engine', 'ejs');

// Define paths for views
const viewsPath = {
    owner: path.join(__dirname, '../frontend/views/owner'),
    tenant: path.join(__dirname, '../frontend/views/tenant'),
    admin: path.join(__dirname, '../frontend/views/admin'),
};

// Middleware to add a nonce for CSP
const crypto = require('crypto');
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  const cspPolicy = process.env.NODE_ENV === 'production'
  ? `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}' https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'nonce-${res.locals.nonce}' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com 'unsafe-inline'; style-src-elem 'self' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' ${root}; report-uri /csp-violation-report-endpoint;`
  : `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' 'nonce-${res.locals.nonce}' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' ${root}; report-uri /csp-violation-report-endpoint;`
  try {
    res.setHeader('Content-Security-Policy', cspPolicy);
  } catch (error) {
    console.error('Error setting CSP header:', error);
  }
  
  next();
});

// Configure middlewares
app.use(cors({
    origin: `${root}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(helmet({ contentSecurityPolicy: false })); // Disable default CSP directives from Helmet
app.use(compression()); // Compress HTTP responses

// Create a write stream for logging
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream })); // Log to file
app.use(morgan('combined')); // Log to console

// Configure static file serving with caching
// const staticOptions = { maxAge: '1d' }; // Cache static files for 1 day
app.use(express.static(path.join(__dirname, '../frontend/css'))); // staticOptions
app.use('/icon', express.static(path.join(__dirname, '../frontend/icon'))); // staticOptions
app.use('/img', express.static(path.join(__dirname, '../frontend/img'))); // staticOptions
app.use(express.static(path.join(__dirname, '../frontend/helper'))); // staticOptions

// Import routers
const frontendAdminRouter = require('./routers/frontendAdminRouter');
const frontendOwnerRouter = require('./routers/frontendOwnerRouter');
const frontendTenantRouter = require('./routers/frontendTenantRouter');
const backendAdminRouter = require('./routers/backendAdmin');
const backendOwnerRouter = require('./routers/backendOwner');
const backendTenantRouter = require('./routers/backendTenant');

// Configure routes
app.use('/admin', (req, res, next) => {
    app.set('views', viewsPath.admin);
    next();
}, frontendAdminRouter);

app.use('/owner', (req, res, next) => {
    app.set('views', viewsPath.owner);
    next();
}, frontendOwnerRouter);

app.use('/tenant', (req, res, next) => {
    app.set('views', viewsPath.tenant);
    next();
}, frontendTenantRouter);

// Route for CSP test
app.get('/test-csp', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test CSP</title>
            <script nonce="${res.locals.nonce}">
            // This should be allowed
            console.log('Test CSP');
            </script>
            <script>
            // This should trigger a CSP violation
            console.log('Test CSP violation');
            </script>
        </head>
        <body>
            <h1>Test CSP</h1>
        </body>
        </html>
    `);
});

// Endpoint to receive CSP violation reports
app.post('/csp-violation-report-endpoint', express.json(), (req, res) => {
    console.log('Request received at /csp-violation-report-endpoint:', req.body);
    const report = req.body['csp-report'] || req.body;
    console.log('CSP Violation Report:', report);

    fs.appendFile(path.join(__dirname, 'csp-reports.log'), `${new Date().toISOString()} -- ${JSON.stringify(report)}\n`, (err) => {
        if (err) {
            console.error('Error recording CSP report:', err);
        }
    });

    res.status(204).end(); // Respond with no content
});

// Configure backend routes
app.use('/backendadmin', backendAdminRouter);
app.use('/backendowner', backendOwnerRouter);
app.use('/backendtenant', backendTenantRouter);

// Route for WebSocket test
app.get('/websocketServerTest', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware to handle unhandled errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).sendFile(path.join(__dirname, '../frontend/error/error-page500.html'));
});

// Middleware to handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/error/error-page404.html'));
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
