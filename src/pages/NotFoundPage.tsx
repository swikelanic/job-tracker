import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container">
      <h2>404 - Page Not Found</h2>
      <p>Oops! This page does not exist.</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
};

export default NotFoundPage;
