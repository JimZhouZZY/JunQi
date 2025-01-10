const { SECRET_KEY } = require('./constants.js');
const jwt = require('jsonwebtoken')
// Middleware to authenticate tokens
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Attach user info to the request object
        next();
    });
}

module.exports = {authenticateToken};
