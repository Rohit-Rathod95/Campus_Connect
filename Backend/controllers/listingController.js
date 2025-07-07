const db = require('../db');

exports.addListing = async (req, res) => {
    // req.user is populated by authMiddleware.js
    if (!req.user || req.user.user_type !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Only owners can add listings.' });
    }

    const {
        title,
        description,
        type,
        price,
        address,
        latitude,
        longitude,
        college_name, // Frontend sends college name
    } = req.body;

    // Get owner details from req.user
    const owner_id = req.user.id;
    const owner_name = req.user.name;
    const owner_number = req.user.mobile_number;

    if (!title || !description || !type || !price || !address || !latitude || !longitude || !college_name) {
        return res.status(400).json({ message: 'All listing fields are required.' });
    }

    try {
        // Find college_id based on college_name
        const [collegeRows] = await db.query('SELECT id FROM colleges WHERE name = ?', [college_name]);
        if (collegeRows.length === 0) {
            return res.status(400).json({ message: 'Selected college not found in database.' });
        }
        const college_id = collegeRows[0].id;

        // Insert into listings table
        const insertQuery = `
            INSERT INTO listings (
                owner_id, title, description, type, price, address,
                latitude, longitude, college_id, college_name, owner_name, owner_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
            owner_id, title, description, type, price, address,
            latitude, longitude, college_id, college_name, owner_name, owner_number
        ];

        await db.query(insertQuery, insertValues);

        res.status(201).json({ message: 'Listing added successfully!' });

    } catch (err) {
        console.error('Error adding listing:', err);
        res.status(500).json({ message: 'Server error while adding listing.', error: err.sqlMessage || err.message });
    }
};

// Get all listings (no join) - could be public or protected
exports.getAllListings = async (req, res) => {
    try {
        const [listings] = await db.query('SELECT * FROM listings');
        res.status(200).json({ listings });
    } catch (err) {
        console.error('Error fetching all listings:', err);
        res.status(500).json({ message: 'Server error fetching listings', error: err });
    }
};

// Get listings by college name (for student dashboard)
exports.getListingsByCollegeName = async (req, res) => {
    const collegeName = req.params.collegeName; // Assuming collegeName is passed as a URL parameter
    try {
        // Joining with users to get owner's contact info
        const [listings] = await db.query(
            `SELECT listings.*, users.name AS owner_name, users.mobile_number AS owner_mobile
             FROM listings
             JOIN users ON listings.owner_id = users.id
             WHERE listings.college_name = ?`,
            [collegeName]
        );
        res.status(200).json({ listings });
    } catch (err) {
        console.error('Error fetching listings by college name:', err);
        res.status(500).json({ message: 'Server error fetching listings by college', error: err });
    }
};

// Get listing by ID
exports.getListingById = async (req, res) => {
    const listingId = req.params.id;
    try {
        const [listings] = await db.query('SELECT * FROM listings WHERE id = ?', [listingId]);
        if (listings.length === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json({ listing: listings[0] });
    } catch (err) {
        console.error('Error fetching listing by ID:', err);
        res.status(500).json({ message: 'Server error fetching listing', error: err });
    }
};

// Get listings by owner (for owner dashboard to view their own listings)
exports.getListingsByOwner = async (req, res) => {
    // req.user is populated by authMiddleware.js
    if (!req.user || req.user.user_type !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Not an owner.' });
    }
    const ownerId = req.user.id;
    try {
        const [listings] = await db.query('SELECT * FROM listings WHERE owner_id = ?', [ownerId]);
        res.status(200).json({ listings });
    } catch (err) {
        console.error('Error fetching listings by owner:', err);
        res.status(500).json({ message: 'Server error fetching owner listings', error: err });
    }
};