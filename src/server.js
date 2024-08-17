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

const app = express();
const server = http.createServer(app);

// Importer et configurer le serveur WebSocket
const configureWebSocket = require('./websocketServer');
configureWebSocket(server);

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');

// Définir les répertoires des vues pour les propriétaires et les locataires
const ownerViewsPath = path.join(__dirname, '../frontend/owner_views');
const tenantViewsPath = path.join(__dirname, '../frontend/tenant_views');

// Middleware pour ajouter un nonce pour CSP
const crypto = require('crypto');

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  const cspPolicy = process.env.NODE_ENV === 'production'
    ? `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}' https://unpkg.com; style-src 'self' https://fonts.googleapis.com https://unpkg.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' http://localhost:3000; report-uri /csp-violation-report-endpoint;`
    : `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' 'unsafe-inline' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' http://localhost:3000; report-uri /csp-violation-report-endpoint;`;
  
  // Affiche la politique CSP dans les logs pour débogage
  console.log('CSP Policy:', cspPolicy);
  
  try {
    res.setHeader('Content-Security-Policy', cspPolicy);
  } catch (error) {
    console.error('Error setting CSP header:', error);
  }
  
  next();
});


console.log('NODE_ENV:', process.env.NODE_ENV);

// Configure les autres middlewares
// app.use(cors()); // Permet les requêtes CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Parser JSON pour les requêtes
app.use(bodyParser.urlencoded({ extended: true })); // Parser les données URL-encodées
// app.use(helmet()); // Sécuriser les en-têtes HTTP
app.use(helmet({
  contentSecurityPolicy: false, // Désactive les directives CSP par défaut de Helmet
}));
app.use(compression()); // Compression des réponses HTTP

// Créer un flux de sortie pour le fichier de log
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Configurer Morgan pour enregistrer dans la console et dans un fichier
app.use(morgan('combined', { stream: logStream })); // Enregistre dans le fichier
app.use(morgan('combined')); // Affiche dans la console

// Servir les fichiers statiques avec mise en cache
app.use(express.static(path.join(__dirname, '../frontend/css'))); // Cache des fichiers CSS pendant 1 jour { maxAge: '1d' } désactivé
app.use(express.static(path.join(__dirname, '../frontend/img'))); // Cache des images pendant 1 jour { maxAge: '1d' } désactivé
app.use(express.static(path.join(__dirname, '../frontend_functions'))); // Cache des fonctions frontend pendant 1 jour { maxAge: '1d' } désactivé
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

// Configurer les vues pour les routes spécifiques
app.use('/owner', (req, res, next) => {
  app.set('views', ownerViewsPath);
  next();
}, frontendOwnerRouter);

app.use('/tenant', (req, res, next) => {
  app.set('views', tenantViewsPath);
  next();
}, frontendTenantRouter);

app.use(express.json());
// Endpoint pour recevoir les rapports CSP
app.post('/csp-violation-report-endpoint', express.json(), (req, res) => {
  console.log('Requête reçue sur /csp-violation-report-endpoint:', req.body);
  const report = req.body['csp-report'] || req.body;
  console.log('CSP Violation Report:', report);
  
  // Enregistrer le rapport dans un fichier
  fs.appendFile(path.join(__dirname, 'csp-reports.log'), new Date().toISOString() + "--"  +  JSON.stringify(report) + '\n', (err) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement du rapport CSP:', err);
    }
  });
  
  res.status(204).end(); // Répondre avec un statut 204 No Content
});

// Route de test CSP
app.get('/test-csp', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test CSP</title>
      <script nonce="${res.locals.nonce}">
        // Ceci devrait être autorisé
        console.log('Test CSP');
      </script>
      <script>
        // Ceci devrait provoquer une violation CSP
        console.log('Test CSP violation');
      </script>
    </head>
    <body>
      <h1>Test CSP</h1>
    </body>
    </html>
  `);
});

// Configurer les routes backend
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

// Démarrer le serveur
const port = 3000;
server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
