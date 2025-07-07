const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/owner', authController.registerOwner);
router.post('/register/student', authController.registerStudent);
router.post('/login', authController.login);

module.exports = router;