const http = require('http');

// Créer un serveur HTTP pour redirection
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
});

// Démarrer le serveur HTTP sur le port 80
httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80 (redirects to HTTPS)');
});