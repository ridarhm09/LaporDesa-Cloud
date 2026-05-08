const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Bypass autentikasi (selalu allow, sebagai user id 1)
    req.user = { id: 1, role: 'admin', name: 'Masyarakat/Admin' };
    next();
};

const authorizeAdmin = (req, res, next) => {
    // Bypass authorize
    next();
};

module.exports = { authenticate, authorizeAdmin };
