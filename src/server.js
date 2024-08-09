const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require("dotenv/config");



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


// Configurer le moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use(express.static(path.join(__dirname, '../frontend/img')));

app.use(express.static(path.join(__dirname, '../frontend_functions')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Importer le router
const frontendrouter = require('./routers/frontendrouter'); 

const backendownerrouter = require('./routers/backend_owner'); // Assurez-vous que le chemin est correct

// Utiliser le router
app.use('/', frontendrouter);

app.use('/backendowner', backendownerrouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
