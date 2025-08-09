import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Job } from '../types';

const statusColors: Record<string, string> = {
  Applied: 'orange',
  Interviewed: 'green',
  Rejected: 'red',
  Declined: 'red',
};

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || id === 'add') {
      setError('Invalid job ID');
      setJob(null);
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await API.get<Job>(`/jobs/${id}`);
        setJob(response.data);
        setError('');
      } catch {
        setError('Job not found');
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p>Loading job details...</p>;

  if (error)
    return (
      <div style={{ padding: '1rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );

  if (!job) return null;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>
        {job.role} @ {job.companyName}
      </h2>
      <p>
        <strong>Status: </strong>
        <span style={{ color: statusColors[job.status] || 'gray' }}>
          {job.status}
        </span>
      </p>
      <p>
        <strong>Date Applied:</strong>{' '}
        {job.dateApplied
          ? new Date(job.dateApplied).toLocaleDateString()
          : 'No Date'}
      </p>

      {job.details && (
        <>
          <h3>Extra Details</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{job.details}</p>
        </>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/jobs" style={{ marginRight: '1rem' }}>
          Back to Jobs
        </Link>
        <Link to={`/jobs/${job.id}/edit`}>Edit Job</Link>
      </div>
    </div>
  );
};

export default JobDetailsPage;
