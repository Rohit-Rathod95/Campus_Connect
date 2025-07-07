import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './OwnerRegister.css';

const OwnerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile_number: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/auth/register/owner', formData)
      .then(res => {
        alert(res.data.message);
        navigate('/owner/login'); // Redirect to login after successful registration
      })
      .catch(err => {
        console.error('Registration error:', err);
        alert(err.response?.data?.message || 'Registration failed');
      });
  };

  return (
    <div className="owner-register-container">
      <h2>Owner Registration</h2>
      <form onSubmit={handleSubmit} className="owner-register-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="mobile_number"
          placeholder="Mobile Number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Register</button>
        <p className="login-note">
          Already have an account? <Link to="/owner/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default OwnerRegister;