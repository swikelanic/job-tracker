import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  role: string;
  companyName: string;
  location: string;
  status: 'Applied' | 'Interviewed' | 'Declined';
  dateApplied: string;
  details?: string;
}

const JobsListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data: Job[] = await res.json();
      setJobs(data);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`http://localhost:5000/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
      await fetchJobs();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // AddJobForm modal component
  const AddJobForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
        await fetchJobs();
        onClose();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            minWidth: 300,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
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
              onClick={onClose}
              style={{ marginLeft: 10, marginTop: 10 }}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>My Jobs</h1>

      <button
        style={{ display: 'inline-block', marginBottom: 20 }}
        onClick={() => setShowAddModal(true)}
      >
        + Add New Job
      </button>

      {jobs.length === 0 ? (
        <p>No jobs added yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Position</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Company</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Location</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Date Applied</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {job.role} @ {job.companyName}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{job.companyName}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{job.location}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{job.status}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {job.dateApplied && !isNaN(new Date(job.dateApplied).getTime())
                    ? new Date(job.dateApplied).toLocaleDateString()
                    : 'No Date'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <button onClick={() => navigate(`/jobs/${job.id}/edit`)}>Edit</button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    style={{ marginLeft: 8, backgroundColor: '#ff4d4f', color: 'white' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && <AddJobForm onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default JobsListPage;
