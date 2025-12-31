'use strict';
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Access the secret from the environment
    const secret = process.env.JWT_SECRET;

    // 1. Check if the secret exists at all
    if (!secret) {
        console.error('❌ AUTH_ERROR: JWT_SECRET is missing from process.env');
        return res.status(500).json({ 
            message: "Server configuration error: Missing Secret Key." 
        });
    }

    // 2. Get the token from the header
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('❌ AUTH_ERROR: Token verification failed:', err.message);
        res.status(401).json({ message: "Token is invalid" });
    }
};