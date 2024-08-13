


const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateOwnerToken(user, time) {
    
    const key = process.env.TOKEN_KEY;
    const payload = {
        userId : user.id,
        userEmail : user.email,
    };

    const options = {
        expiresIn : time
    };

    const token = jwt.sign(payload, key, options);

    return token;

}

function generateTenantToken(user, time) {
    
    const key = process.env.TOKEN_KEY;
    const payload = {
        userId : user.id,
        prTenID : user.email,
    };

    const options = {
        expiresIn : time
    };

    const token = jwt.sign(payload, key, options);

    return token;

}

module.exports = {generateOwnerToken, generateTenantToken};