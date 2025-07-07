const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get student profile by email (can be used after login to get college name)
// This should ideally be protected so only the logged-in student or an admin can access their profile
router.get('/profile/:email', authMiddleware, studentController.getStudentProfileByEmail);

module.exports = router;