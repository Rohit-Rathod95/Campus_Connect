const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        if (decoded.user_type === 'owner') {
            // Fetch owner details from 'users' table
            const [rows] = await db.query('SELECT id, name, email, mobile_number, user_type FROM users WHERE id = ?', [decoded.id]);
            user = rows[0];
        } else if (decoded.user_type === 'student') {
            // Fetch student details from 'students' table
            const [rows] = await db.query('SELECT id, name, email, college_id, "student" AS user_type FROM students WHERE id = ?', [decoded.id]);
            user = rows[0];
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach the full user object to the request
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};