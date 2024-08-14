// middlewares/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, tokendata) => {
        if (err) {
            return res.status(403).json({ message: 'Token not valid' });
        }
        req.user = tokendata; // Ajouter les données du token à la requête
        next(); // Passer au prochain middleware ou route
    });
};
