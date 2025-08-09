import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Job } from '../types';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const statusColors: Record<string, string> = {
  Applied: 'orange',
  Interviewed: 'green',
  Rejected: 'red',
};

const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const statusFilter = searchParams.get('status') || '';
  const sortOrder = searchParams.get('sort') || 'desc';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await API.get<Job[]>('/jobs');
        let data = res.data;

        if (statusFilter) {
          data = data.filter((job) => job.status === statusFilter);
        }

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          data = data.filter(
            (job) =>
              job.companyName.toLowerCase().includes(q) ||
              job.role.toLowerCase().includes(q)
          );
        }

        data.sort((a, b) =>
          sortOrder === 'asc'
            ? new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime()
            : new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
        );

        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [statusFilter, sortOrder, searchQuery]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await API.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch {
      alert('Failed to delete job');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Jobs You Applied For</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by company or role"
          value={searchQuery}
          onChange={(e) => updateFilters('search', e.target.value)}
          style={{ marginRight: '1rem', padding: '0.3rem' }}
        />

        <select
          value={statusFilter}
          onChange={(e) => updateFilters('status', e.target.value)}
          style={{ marginRight: '1rem', padding: '0.3rem' }}
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => updateFilters('sort', e.target.value)}
          style={{ padding: '0.3rem' }}
        >
          <option value="desc">Date Descending</option>
          <option value="asc">Date Ascending</option>
        </select>

        <button
          style={{
            marginLeft: '1rem',
            padding: '0.4rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          onClick={() => navigate('/jobs/new')}
        >
          + Add New Job
        </button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li
              key={job.id}
              style={{
                border: '1px solid #ccc',
                marginBottom: '1rem',
                padding: '1rem',
                borderLeft: `6px solid ${statusColors[job.status] || 'gray'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <h3>
                    {job.role} @ {job.companyName}
                  </h3>
                </Link>
                <p>
                  Status: <span style={{ color: statusColors[job.status] }}>{job.status}</span>
                </p>
                <p>Date Applied: {new Date(job.dateApplied).toLocaleDateString()}</p>
              </div>

              <div>
                <Link
                  to={`/jobs/${job.id}/edit`}
                  style={{
                    marginRight: '1rem',
                    textDecoration: 'none',
                    color: 'blue',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => job.id !== undefined && handleDelete(job.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                  aria-label={`Delete job ${job.role} at ${job.companyName}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
