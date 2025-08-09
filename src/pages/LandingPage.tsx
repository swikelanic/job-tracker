import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="container">
      <h1>🎯 Job Application Tracker</h1>
      <p>Track all your job applications in one place. Stay organized, stay ready!</p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
};

export default LandingPage;
