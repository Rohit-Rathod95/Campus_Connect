require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const collegeRoutes = require('./routes/colleges');
const studentRoutes = require('./routes/students');

const app = express();

// ⭐ NEW: Initialize Database Connection Pool
const db = require('./db'); // This line executes db.js and creates the pool

// Optional: Test the connection pool on server startup (good for debugging)
db.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database via pool.');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to MySQL database:', err);
  });


app.use(cors());
app.use(express.json());

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});