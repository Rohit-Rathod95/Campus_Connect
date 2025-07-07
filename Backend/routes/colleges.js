const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');

router.get('/', collegeController.getAllColleges); // Public route to fetch all colleges

module.exports = router;