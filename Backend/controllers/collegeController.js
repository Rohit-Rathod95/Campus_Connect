const db = require('../db'); // Ensure this path is correct: '../db'

exports.getAllColleges = async (req, res) => { // ⭐ Make sure the function is 'async'
    try {
        // ⭐ Use 'await' and destructure the result as '[rows]'
        const [rows] = await db.query('SELECT id, name, city FROM colleges ORDER BY name');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.status(500).json({ message: 'Error fetching colleges', error: err.message });
    }
};