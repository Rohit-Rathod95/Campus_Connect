import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [errorListings, setErrorListings] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!token || userType !== 'student') {
      navigate('/student/login');
      return;
    }

    const fetchStudentListings = async () => {
      setLoadingListings(true);
      setErrorListings(null);

      try {
        // ✅ 1. Get student profile to fetch college_name
        const studentRes = await axios.get(`http://localhost:5000/api/students/profile/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const studentCollegeName = studentRes.data.student.college_name;

        // ✅ 2. Get listings for that college
        const listingsRes = await axios.get(`http://localhost:5000/api/listings/my-college/${studentCollegeName}`);
        setListings(listingsRes.data.listings || []);
      } catch (err) {
        console.error('Error fetching student listings:', err);
        setErrorListings('Failed to load listings near your college. Please try again.');
        setListings([]);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchStudentListings();
  }, [navigate, token, userType, userEmail]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Available Options near My College</h2>
        {userName && <p>Welcome, {userName}!</p>}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {loadingListings ? (
        <p>Loading listings...</p>
      ) : errorListings ? (
        <p className="error-message">{errorListings}</p>
      ) : listings.length === 0 ? (
        <p className="no-listings">No listings found near your college.</p>
      ) : (
        listings.map(listing => (
          <div key={listing.id} className="listing-card">
            <h4>{listing.title}</h4>
            <p>{listing.description}</p>
            <p>
              <strong>Type:</strong> {listing.type} | <strong>Price:</strong> ₹{listing.price}
            </p>
            <p>
              <strong>Address:</strong> {listing.address} | <strong>College:</strong> {listing.college_name}
            </p>
            <p><strong>Owner Name:</strong> {listing.owner_name}</p>
            <p><strong>Mobile Number:</strong> {listing.owner_mobile}</p>

            <div className="map-wrapper">
              {listing.latitude && listing.longitude ? (
                <MapView lat={parseFloat(listing.latitude)} lng={parseFloat(listing.longitude)} />
              ) : (
                <p>No map coordinates provided.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentDashboard;
