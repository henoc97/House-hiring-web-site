// middlewares/tokenVerification.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (ws, request, callback) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    console.log("token: " + token);
    if (!token) {
        ws.close(4000, 'Token manquant');
        console.log('Token manquant');
        return;
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            ws.close(4001, 'Token invalide');
            console.log('Token invalide');
            return;
        }

        // Ajouter les informations du token au WebSocket
        ws.user = decoded;
        callback();
    });
};
