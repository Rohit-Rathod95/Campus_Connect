import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OwnerDashboard.css';
import MapView from '../components/MapView';

const OwnerDashboard = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const [colleges, setColleges] = useState([]);
    const [loadingColleges, setLoadingColleges] = useState(true);
    const [errorColleges, setErrorColleges] = useState(null);

    const [formData, setFormData] = useState({
        title: '', description: '', type: '', price: '', address: '',
        latitude: '', longitude: '', college_name: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [ownerListings, setOwnerListings] = useState([]);
    const [loadingOwnerListings, setLoadingOwnerListings] = useState(true);
    const [errorOwnerListings, setErrorOwnerListings] = useState(null);

    const navigate = useNavigate();

    // Step 1: Load user and token from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');
        setUser(storedUser);
        setToken(storedToken);
    }, []);

    // Step 2: Fetch data only after user/token are loaded
    useEffect(() => {
        if (user === null || token === null) return; // still loading

        if (!user || !token || user.user_type !== 'owner') {
            navigate('/login');
            return;
        }

        const fetchColleges = async () => {
            setLoadingColleges(true);
            setErrorColleges(null);
            try {
                const res = await axios.get('http://localhost:5000/api/colleges');
                setColleges(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('❌ Error fetching colleges:', err);
                setErrorColleges('Failed to load colleges.');
            } finally {
                setLoadingColleges(false);
            }
        };

        const fetchOwnerListings = async () => {
            setLoadingOwnerListings(true);
            setErrorOwnerListings(null);
            try {
                const res = await axios.get('http://localhost:5000/api/listings/owner', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOwnerListings(res.data.listings || []);
            } catch (err) {
                console.error('❌ Error fetching owner listings:', err);
                setErrorOwnerListings('Failed to load your listings.');
                setOwnerListings([]);
            } finally {
                setLoadingOwnerListings(false);
            }
        };

        fetchColleges();
        fetchOwnerListings();
    }, [user, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await axios.post('http://localhost:5000/api/listings/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                alert('✅ Listing added successfully!');
                const updatedListingsRes = await axios.get('http://localhost:5000/api/listings/owner', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOwnerListings(updatedListingsRes.data.listings || []);

                setFormData({
                    title: '', description: '', type: '', price: '', address: '',
                    latitude: '', longitude: '', college_name: ''
                });
            } else {
                alert('Something went wrong. Listing might not have been added.');
            }
        } catch (err) {
            console.error('❌ Error adding listing:', err.response?.data || err.message);
            alert(err.response?.data?.message || "❌ Server error while adding listing. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (user === null || token === null) {
        return <div>🔄 Loading dashboard...</div>;
    }

    return (
        <div className="owner-dashboard">
            <div className="dashboard-header">
                <h1>Owner Dashboard</h1>
                {user && (
                    <div className="user-info">
                        Welcome, {user.name}! Contact: {user.mobile_number}
                    </div>
                )}
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            <div className="form-section">
                <h2>Add New Listing</h2>
                <form onSubmit={handleSubmit} className="listing-form">
                    <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                    <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">-- Select Type --</option>
                        <option value="mess">Mess</option>
                        <option value="PG">PG</option>
                        <option value="hostel">Hostel</option>
                        <option value="flat">Flat</option>
                    </select>
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
                    <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                    <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} step="any" />
                    <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} step="any" />

                    {loadingColleges ? (
                        <p>Loading colleges...</p>
                    ) : errorColleges ? (
                        <p className="error-message">{errorColleges}</p>
                    ) : (
                        <select name="college_name" value={formData.college_name} onChange={handleChange} required>
                            <option value="">-- Select College --</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.name}>
                                    {college.name} ({college.city})
                                </option>
                            ))}
                        </select>
                    )}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding Listing...' : 'Add Listing'}
                    </button>
                </form>
            </div>

            <hr />

            <div className="my-listings-section">
                <h2>My Current Listings</h2>
                {loadingOwnerListings ? (
                    <p>Loading your listings...</p>
                ) : errorOwnerListings ? (
                    <p className="error-message">{errorOwnerListings}</p>
                ) : ownerListings.length === 0 ? (
                    <p className="no-listings">You have no listings yet. Add one above!</p>
                ) : (
                    <div className="listings-grid">
                        {ownerListings.map(listing => (
                            <div key={listing.id} className="listing-card">
                                <h4>{listing.title}</h4>
                                <p>{listing.description}</p>
                                <p><strong>Type:</strong> {listing.type} | <strong>Price:</strong> ₹{listing.price}</p>
                                <p><strong>Address:</strong> {listing.address}</p>
                                <p><strong>College:</strong> {listing.college_name} ({listing.college_city})</p>
                                <p><strong>Owner:</strong> {listing.owner_name} | <strong>Contact:</strong> {listing.owner_number}</p>
                                {(listing.latitude && listing.longitude) ? (
                                    <MapView lat={parseFloat(listing.latitude)} lng={parseFloat(listing.longitude)} />
                                ) : (
                                    <p>No map coordinates available.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
