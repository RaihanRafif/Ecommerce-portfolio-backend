// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

    if (token == null) {
        // Return a descriptive error message
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Return a descriptive error message for invalid token
            return res.status(403).json({ message: 'Token is not valid' });
        }

        req.user = user.user;
        next();
    });
};
