import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './StudentRegister.css';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college_name: '',
    college_city: ''
  });

  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [errorColleges, setErrorColleges] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch all colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      setLoadingColleges(true);
      try {
        const res = await axios.get('http://localhost:5000/api/colleges');
        setColleges(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching colleges:', err);
        setErrorColleges('Failed to load colleges.');
        setColleges([]);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  // ✅ Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'college_name') {
      const selectedCollege = colleges.find(col => col.name === value);
      if (selectedCollege) {
        setFormData(prev => ({ ...prev, college_city: selectedCollege.city }));
      } else {
        setFormData(prev => ({ ...prev, college_city: '' }));
      }
    }
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/auth/register/student', formData)
      .then(res => {
        alert(res.data.message || 'Registration successful');
        navigate('/student/login');
      })
      .catch(err => {
        console.error('Registration error:', err);
        alert(err.response?.data?.message || 'Registration failed');
      });
  };

  return (
    <div className="student-register-container">
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit} className="student-register-form">
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        {loadingColleges ? (
          <p>Loading colleges...</p>
        ) : errorColleges ? (
          <p className="error-message">{errorColleges}</p>
        ) : (
          <select
            name="college_name"
            value={formData.college_name}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Your College --</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.name}>
                {college.name} ({college.city})
              </option>
            ))}
          </select>
        )}
        <br />

        <input
          type="text"
          name="college_city"
          placeholder="College City (auto-filled)"
          value={formData.college_city}
          readOnly
          required
        /><br />

        <button type="submit">Register</button>
        <p className="login-note">
          Already have an account? <Link to="/student/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default StudentRegister;
