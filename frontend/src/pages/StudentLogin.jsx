import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './StudentLogin.css';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/auth/login', formData)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.user.name);
        localStorage.setItem('userEmail', res.data.user.email);
        localStorage.setItem('userType', res.data.user.user_type);
        // Student-specific data like college can be stored if needed after fetching from a separate endpoint
        // or if the login response includes it.

        alert("Login successful!");

        const userType = res.data.user.user_type;
        if (userType === 'student') {
          navigate('/student/dashboard');
        } else if (userType === 'owner') {
          navigate('/owner/dashboard'); // Should not happen with StudentLogin, but good fallback
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
    <div className="student-login-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit} className="student-login-form">
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
          Don't have a student account? <Link to="/student/register">Register as Student</Link>
        </p>
        <p className="register-note">
          Are you an owner? <Link to="/owner/login">Login as Owner</Link>
        </p>
      </form>
    </div>
  );
};

export default StudentLogin;