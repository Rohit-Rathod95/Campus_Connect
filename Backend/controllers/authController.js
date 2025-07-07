const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Owner Registration
exports.registerOwner = async (req, res) => {
    const { name, email, password, mobile_number } = req.body;

    if (!name || !email || !password || !mobile_number) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, mobile_number, user_type) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, mobile_number, 'owner']
        );

        res.status(201).json({ message: 'Owner registered successfully' });
    } catch (err) {
        console.error('Owner registration error:', err);
        res.status(500).json({ message: 'Server error during owner registration', error: err });
    }
};

// Student Registration
exports.registerStudent = async (req, res) => {
    const { name, email, password, college_name, college_city } = req.body;

    if (!name || !email || !password || !college_name || !college_city) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let college_id;
        // Check if college exists
        const [college] = await db.query(
            'SELECT id FROM colleges WHERE name = ? AND city = ?',
            [college_name, college_city]
        );

        if (college.length > 0) {
            college_id = college[0].id;
        } else {
            // If college doesn't exist, insert it
            const [result] = await db.query(
                'INSERT INTO colleges (name, city) VALUES (?, ?)',
                [college_name, college_city]
            );
            college_id = result.insertId;
        }

        const [existing] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO students (name, email, password, college_id) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, college_id]
        );

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (err) {
        console.error('Student registration error:', err);
        res.status(500).json({ message: 'Server error during student registration', error: err });
    }
};

// Common Login for both students and owners
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query both users (owners) and students tables using UNION
        const [users] = await db.query(
            `SELECT id, name, email, password, mobile_number, 'owner' AS user_type FROM users WHERE email = ?
             UNION
             SELECT id, name, email, password, NULL AS mobile_number, 'student' AS user_type FROM students WHERE email = ?`,
            [email, email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Sign the JWT with user id and type
        const token = jwt.sign({ id: user.id, user_type: user.user_type }, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token expires in 1 day
        });

        // Include mobile_number in the response user object for owners
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.user_type,
                mobile_number: user.mobile_number // Will be null for students, defined for owners
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login', error: err });
    }
};