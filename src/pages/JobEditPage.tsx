import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  role: string;
  companyName: string;
  location: string;
  status: 'Applied' | 'Interviewed' | 'Declined';
  dateApplied: string;
  details?: string;
}

const JobEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/jobs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch job');
        const data: Job = await res.json();
        setJob(data);
        setError('');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      setSaving(true);
      const res = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error('Failed to update job');
      alert('Job updated successfully!');
      navigate('/jobs');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Position (Role):</label><br />
          <input
            type="text"
            value={job.role}
            onChange={e => setJob({ ...job, role: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Company Name:</label><br />
          <input
            type="text"
            value={job.companyName}
            onChange={e => setJob({ ...job, companyName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Location:</label><br />
          <input
            type="text"
            value={job.location}
            onChange={e => setJob({ ...job, location: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Status:</label><br />
          <select
            value={job.status}
            onChange={e =>
              setJob({ ...job, status: e.target.value as 'Applied' | 'Interviewed' | 'Declined' })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
        <div>
          <label>Date Applied:</label><br />
          <input
            type="date"
            value={job.dateApplied ? job.dateApplied.substring(0, 10) : ''}
            onChange={e => setJob({ ...job, dateApplied: e.target.value + 'T00:00:00.000Z' })}
            required
          />
        </div>
        <div>
          <label>Details:</label><br />
          <textarea
            value={job.details || ''}
            onChange={e => setJob({ ...job, details: e.target.value })}
            rows={4}
            cols={50}
          />
        </div>
        <button type="submit" disabled={saving} style={{ marginTop: 10 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          disabled={saving}
          style={{ marginLeft: 10, marginTop: 10 }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default JobEditPage;
