const express = require('express');
const http = require('http'); // Corrigé pour la production sur Render
const https = require('https');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const { ROOT_URL } = require('./endpoint');
const cspMiddleware = require('../middlewares/http/csp');
const { logger } = require('./logger/logRotation');

// Create Express application
const app = express();

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
app.use(
  cors({
    origin: `${ROOT_URL}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// Create a write stream for logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Configure static file serving
app.use(express.static(path.join(__dirname, '../frontend/css')));
app.use('/icon', express.static(path.join(__dirname, '../frontend/icon')));
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));
app.use(express.static(path.join(__dirname, '../frontend/helper')));

// Import routers
const frontendAdmin = require('./routers/frontendAdmin');
const frontendOwner = require('./routers/frontendOwner');
const frontendTenant = require('./routers/frontendTenant');
const backendCspReport = require('./routers/backendCspReport');
const backendAdmin = require('./routers/backendAdmin');
const backendOwner = require('./routers/backendOwner');
const backendTenant = require('./routers/backendTenant');

// Configure routes
app.use(
  '/admin',
  (req, res, next) => {
    app.set('views', viewsPath.admin);
    next();
  },
  frontendAdmin
);
app.use(
  '/owner',
  (req, res, next) => {
    app.set('views', viewsPath.owner);
    next();
  },
  frontendOwner
);
app.use(
  '/tenant',
  (req, res, next) => {
    app.set('views', viewsPath.tenant);
    next();
  },
  frontendTenant
);
app.use('/backend-csp-report', backendCspReport);
app.use('/backend-admin', backendAdmin);
app.use('/backend-owner', backendOwner);
app.use('/backend-tenant', backendTenant);

// Middleware to handle unhandled errors
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.stack);
  res
    .status(500)
    .sendFile(path.join(__dirname, '../frontend/error/error-page500.html'));
});

// Middleware to handle 404 errors
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res
    .status(404)
    .sendFile(path.join(__dirname, '../frontend/error/error-page404.html'));
});

// Create the server
const port = process.env.PORT;
const server = http.createServer(app); // Render fournit HTTPS

// Import and configure WebSocket server
const configureWebSocket = require('./websocketServer');
configureWebSocket(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
