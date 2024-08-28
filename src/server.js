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
const cspMiddleware = require('../middlewares/http/csp');

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

// use CSP middleware
app.use(cspMiddleware)

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
const logStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), { flags: 'a' });
// Setup logging for different environments
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: logStream })); // Log to file only in production
} else {
    app.use(morgan('dev')); // More detailed logging for development
}

// Configure static file serving with caching
// const staticOptions = { maxAge: '1d' }; // Cache static files for 1 day
app.use(express.static(path.join(__dirname, '../frontend/css'))); // staticOptions
app.use('/icon', express.static(path.join(__dirname, '../frontend/icon'))); // staticOptions
app.use('/img', express.static(path.join(__dirname, '../frontend/img'))); // staticOptions
app.use(express.static(path.join(__dirname, '../frontend/helper'))); // staticOptions

// Import routers
const frontendAdmin = require('./routers/frontendAdmin');
const frontendOwner = require('./routers/frontendOwner');
const frontendTenant = require('./routers/frontendTenant');
const backendCspReport = require('./routers/backendCspReport');
const backendAdmin = require('./routers/backendAdmin');
const backendOwner = require('./routers/backendOwner');
const backendTenant = require('./routers/backendTenant');

// Configure routes
app.use('/admin', (req, res, next) => {
    app.set('views', viewsPath.admin);
    next();
}, frontendAdmin);

app.use('/owner', (req, res, next) => {
    app.set('views', viewsPath.owner);
    next();
}, frontendOwner);

app.use('/tenant', (req, res, next) => {
    app.set('views', viewsPath.tenant);
    next();
}, frontendTenant);

// Configure backend routes
app.use('/backend-csp-report', backendCspReport);
app.use('/backend-admin', backendAdmin);
app.use('/backend-owner', backendOwner);
app.use('/backend-tenant', backendTenant);

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
