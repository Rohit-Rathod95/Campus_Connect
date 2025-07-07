import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './OwnerLogin.css';

const OwnerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/auth/login', formData)
      .then(res => {
        // ✅ Store full user object for dashboard access
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // ✅ Important for dashboard
        localStorage.setItem('userName', res.data.user.name);
        localStorage.setItem('userEmail', res.data.user.email);
        localStorage.setItem('userType', res.data.user.user_type);
        if (res.data.user.mobile_number) {
          localStorage.setItem('userMobile', res.data.user.mobile_number);
        }

        alert("Login successful!");

        const userType = res.data.user.user_type;
        if (userType === 'owner') {
          navigate('/owner/dashboard');
        } else if (userType === 'student') {
          navigate('/student/dashboard'); // Fallback
        } else {
          navigate('/');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert(err.response?.data?.message || 'Invalid email or password');
      });
  };

  return (
    <div className="owner-login-container">
      <h2>Owner Login</h2>
      <form onSubmit={handleSubmit} className="owner-login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <button type="submit">Login</button>
        <p className="register-note">
          Don't have an owner account? <Link to="/owner/register">Register as Owner</Link>
        </p>
        <p className="register-note">
          Are you a student? <Link to="/student/login">Login as Student</Link>
        </p>
      </form>
    </div>
  );
};

export default OwnerLogin;
