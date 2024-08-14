// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const apicache = require('apicache');
require("dotenv/config");

const app = express();
const server = http.createServer(app);

// Importer et configurer le serveur WebSocket
const configureWebSocket = require('./websocketServer');
configureWebSocket(server);

// Configure les middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');

// Définir les répertoires des vues pour les propriétaires et les locataires
const ownerViewsPath = path.join(__dirname, '../frontend/owner_views');
const tenantViewsPath = path.join(__dirname, '../frontend/tenant_views');

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend/css')));
app.use(express.static(path.join(__dirname, '../frontend/img')));
app.use(express.static(path.join(__dirname, '../frontend_functions')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importer les routes
const frontendOwnerRouter = require('./routers/frontendOwnerRouter'); 
const frontendTenantRouter = require('./routers/frontendTenantRouter'); 
const backendOwnerRouter = require('./routers/backend_owner'); 
const backendTenantRouter = require('./routers/backend_tenant'); 

// Utiliser les routes avec cache
app.use('/owner', (req, res, next) => {
  app.set('views', ownerViewsPath);
  next();
}, /* cache('5 minutes'), */ frontendOwnerRouter);

app.use('/tenant', (req, res, next) => {
  app.set('views', tenantViewsPath);
  next();
}, /* cache('5 minutes'), */ frontendTenantRouter);

app.use('/backendowner', backendOwnerRouter);
app.use('/backendtenant', backendTenantRouter);

app.get('/websocketServerTest', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 3000;

server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
