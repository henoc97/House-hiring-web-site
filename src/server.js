

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Pour gérer les fichiers
const apicache = require('apicache');
const helmet = require('helmet'); // Sécuriser les en-têtes HTTP
const compression = require('compression'); // Compression des réponses HTTP
const morgan = require('morgan'); // Logger des requêtes HTTP
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Importer et configurer le serveur WebSocket
const configureWebSocket = require('./websocketServer');
configureWebSocket(server);

// Configure les middlewares
app.use(cors()); // Permet les requêtes CORS
app.use(bodyParser.json()); // Parser JSON pour les requêtes
app.use(bodyParser.urlencoded({ extended: true })); // Parser les données URL-encodées
app.use(helmet()); // Sécuriser les en-têtes HTTP
app.use(compression()); // Compression des réponses HTTP

// Créer un flux de sortie pour le fichier de log
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Configurer Morgan pour enregistrer dans la console et dans un fichier
app.use(morgan('combined', { stream: logStream })); // Enregistre dans le fichier
app.use(morgan('combined')); // Affiche dans la console

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');

// Définir les répertoires des vues pour les propriétaires et les locataires
const ownerViewsPath = path.join(__dirname, '../frontend/owner_views');
const tenantViewsPath = path.join(__dirname, '../frontend/tenant_views');

// Servir les fichiers statiques avec mise en cache
app.use(express.static(path.join(__dirname, '../frontend/css'), { maxAge: '1d' })); // Cache des fichiers CSS pendant 1 jour
app.use(express.static(path.join(__dirname, '../frontend/img'), { maxAge: '1d' })); // Cache des images pendant 1 jour
app.use(express.static(path.join(__dirname, '../frontend_functions'), { maxAge: '1d' })); // Cache des fonctions frontend pendant 1 jour
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir les fichiers uploadés

// Importer les routes
const frontendOwnerRouter = require('./routers/frontendOwnerRouter');
const frontendTenantRouter = require('./routers/frontendTenantRouter');
const backendOwnerRouter = require('./routers/backend_owner');
const backendTenantRouter = require('./routers/backend_tenant');

// Utiliser les routes avec cache (si activé)
// Commenté pour l'instant, décommentez si vous activez le cache
// const cache = apicache.middleware;
// app.use('/owner', (req, res, next) => {
//   app.set('views', ownerViewsPath);
//   next();
// }, cache('5 minutes'), frontendOwnerRouter);

// app.use('/tenant', (req, res, next) => {
//   app.set('views', tenantViewsPath);
//   next();
// }, cache('5 minutes'), frontendTenantRouter);

app.use('/owner', (req, res, next) => {
  app.set('views', ownerViewsPath);
  next();
}, frontendOwnerRouter);

app.use('/tenant', (req, res, next) => {
  app.set('views', tenantViewsPath);
  next();
}, frontendTenantRouter);

app.use('/backendowner', backendOwnerRouter);
app.use('/backendtenant', backendTenantRouter);

// Route de test pour le WebSocket
app.get('/websocketServerTest', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware pour gérer les erreurs non gérées
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err.stack);
  res.status(500).send('Erreur interne du serveur.');
});

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

const port = 3000;

server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
