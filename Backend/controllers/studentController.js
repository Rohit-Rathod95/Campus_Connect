const db = require('../db');

exports.getStudentProfileByEmail = async (req, res) => {
    const studentEmail = req.params.email;

    try {
        // Fetch student details along with their college name
        const [rows] = await db.query(
            `SELECT s.id, s.name, s.email, c.name AS college_name, c.city AS college_city
             FROM students s
             JOIN colleges c ON s.college_id = c.id
             WHERE s.email = ?`,
            [studentEmail]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ student: rows[0] });
    } catch (err) {
        console.error('Error fetching student profile:', err);
        res.status(500).json({ message: 'Server error fetching student profile', error: err.message });
    }
};