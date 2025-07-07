const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

router.post('/add', authMiddleware, listingController.addListing); // Protected: only authenticated users (owners) can add
router.get('/', listingController.getAllListings); // Public for now
router.get('/my-college/:collegeName', listingController.getListingsByCollegeName); // For student dashboard (can be public or protected)
router.get('/owner', authMiddleware, listingController.getListingsByOwner); // Protected: owner views their own listings
router.get('/:id', listingController.getListingById); // Public for now

module.exports = router;