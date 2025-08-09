import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.appName}>JobTrackr</h1>
        <p style={styles.tagline}>Organize your job hunt with clarity and confidence.</p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="Job search illustration"
          style={styles.illustration}
        />

        <p style={styles.cta}>Track your job search like a pro.</p>

        <div style={styles.buttonGroup}>
          <Link to="/login" style={styles.button}>Login</Link>
          <Link to="/register" style={{ ...styles.button, backgroundColor: '#6c63ff' }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  content: {
    maxWidth: '600px',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '3rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  },
  appName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333',
  },
  tagline: {
    fontSize: '1.1rem',
    color: '#777',
    marginBottom: '2rem',
  },
  illustration: {
    width: '200px',
    margin: '1rem auto',
  },
  cta: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginTop: '1.5rem',
    marginBottom: '2rem',
    color: '#444',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'background-color 0.3s ease',
  },
};

export default WelcomePage;
