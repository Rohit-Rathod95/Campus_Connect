import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Campus Connect</h1>
      <p>Find your perfect Mess, PG, or Hostel near your college.</p>
      <div className="home-links">
        <Link to="/owner/login" className="home-button">Owner Login</Link>
        <Link to="/owner/register" className="home-button">Owner Register</Link>
        <Link to="/student/login" className="home-button">Student Login</Link>
        <Link to="/student/register" className="home-button">Student Register</Link>
      </div>
    </div>
  );
};

export default Home;