import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddJobPage: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'Applied' | 'Interviewed' | 'Declined'>('Applied');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role.trim() || !companyName.trim() || !location.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newJob = {
      role: role.trim(),
      companyName: companyName.trim(),
      location: location.trim(),
      status,
      dateApplied: new Date().toISOString(),
      details: '',
    };

    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      if (!res.ok) throw new Error('Failed to add job');
      navigate('/jobs');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Job</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Position (Role):</label><br />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            placeholder="Frontend Developer"
          />
        </div>
        <div>
          <label>Company Name:</label><br />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="Tech Corp"
          />
        </div>
        <div>
          <label>Location:</label><br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Cape Town"
          />
        </div>
        <div>
          <label>Status:</label><br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Applied' | 'Interviewed' | 'Declined')}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'Adding...' : 'Add Job'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          style={{ marginLeft: 10, marginTop: 10 }}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddJobPage;
