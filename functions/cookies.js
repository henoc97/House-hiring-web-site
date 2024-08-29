

function createSecureCookie(res, token, type) {
    res.cookie( type + 'Token', token, {
        httpOnly: true,          // Interdit l'accès via JavaScript
        secure: true,            // Nécessite HTTPS
        sameSite: 'strict',      // Préviens les attaques CSRF
        maxAge: 4 * 24 * 60 * 60 * 1000 // 4 jour
    });
}

function readCookie(req, cookieName) {
    return req.cookies[cookieName];
}

function clearCookie(res, cookieName) {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
}

module.exports = { createSecureCookie, readCookie, clearCookie };