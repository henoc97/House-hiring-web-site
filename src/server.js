// server.js

const express = require('express');
const https = require('https');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const apicache = require('apicache');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const { ROOT_URL } = require('./endpoint');
const cspMiddleware = require('../middlewares/http/csp');
const { logger } = require('./logger/logRotation');

// Build absolute paths for SSL certificates
const privateKeyPath = path.resolve(__dirname, '../ssl/server.key');
const certificatePath = path.resolve(__dirname, '../ssl/server.crt');

// Load SSL certificates
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an Express application and an HTTPS server
const app = express();
const server = https.createServer(credentials, app);

// Configure and create apicache instance
const cache = apicache.middleware;

// Configure EJS template engine
app.set('view engine', 'ejs');

// Define paths for views
const viewsPath = {
    owner: path.join(__dirname, '../frontend/views/owner'),
    tenant: path.join(__dirname, '../frontend/views/tenant'),
    admin: path.join(__dirname, '../frontend/views/admin'),
};

// Use CSP middleware
app.use(cspMiddleware);

// Configure middlewares
app.use(cors({
    origin: `${ROOT_URL}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false })); // Disable default CSP directives from Helmet
app.use(compression()); // Compress HTTP responses

// Log incoming requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Configure static file serving with caching
app.use(express.static(path.join(__dirname, '../frontend/css'), { maxAge: '1d' })); // Cache static files for 1 day
app.use('/icon', express.static(path.join(__dirname, '../frontend/icon'), { maxAge: '1d' })); // Cache static files for 1 day
app.use('/img', express.static(path.join(__dirname, '../frontend/img'), { maxAge: '1d' })); // Cache static files for 1 day
app.use(express.static(path.join(__dirname, '../frontend/helper'), { maxAge: '1d' })); // Cache static files for 1 day

// Import routers
const frontendAdmin = require('./routers/frontendAdmin');
const frontendOwner = require('./routers/frontendOwner');
const frontendTenant = require('./routers/frontendTenant');
const backendCspReport = require('./routers/backendCspReport');
const backendAdmin = require('./routers/backendAdmin');
const backendOwner = require('./routers/backendOwner');
const backendTenant = require('./routers/backendTenant');

// Configure routes with caching
app.use('/admin', cache('10 minutes'), (req, res, next) => {
    app.set('views', viewsPath.admin);
    next();
}, frontendAdmin);

app.use('/owner', cache('10 minutes'), (req, res, next) => {
    app.set('views', viewsPath.owner);
    next();
}, frontendOwner);

app.use('/tenant', cache('10 minutes'), (req, res, next) => {
    app.set('views', viewsPath.tenant);
    next();
}, frontendTenant);

// Configure backend routes with caching
app.use('/backend-csp-report', cache('15 minutes'), backendCspReport);
app.use('/backend-admin', cache('15 minutes'), backendAdmin);
app.use('/backend-owner', cache('15 minutes'), backendOwner);
app.use('/backend-tenant', cache('15 minutes'), backendTenant);

// Middleware to handle unhandled errors
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err.stack);
    res.status(500).sendFile(path.join(__dirname, '../frontend/error/error-page500.html'));
});

// Middleware to handle 404 errors
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).sendFile(path.join(__dirname, '../frontend/error/error-page404.html'));
});

// Start the server
const port = process.env.PORT || 8443;
server.listen(port, () => {
    console.log(`HTTPS Server is running on port ${port}`);
});
