import React, { useEffect, useState } from 'react';

interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  status: 'pending' | 'interview' | 'declined';
  date: string;
}

const statusMapBackendToFrontend = (status: string): Job['status'] => {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'pending';
    case 'interviewed':
      return 'interview';
    case 'rejected':
      return 'declined';
    default:
      return 'pending'; // default fallback
  }
};

const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === '') return 'No Date Provided';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Invalid Date Format' : d.toLocaleDateString();
};

const JobsAppliedPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/jobs');
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();

        // Map backend jobs to frontend Job interface
        const normalizedJobs: Job[] = data.map((job: any) => ({
          id: job.id,
          title: job.role || job.title || 'No Title',
          company: job.companyName || job.company || 'No Company',
          location: job.location || 'No Location',
          status: statusMapBackendToFrontend(job.status),
          date: job.dateApplied || job.date || '',
        }));

        // Filter out 'pending' (i.e., keep only 'interview' and 'declined')
        const appliedJobs = normalizedJobs.filter(job => job.status !== 'pending');

        setJobs(appliedJobs);
        setError('');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading applied jobs...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Jobs Applied For</h1>
      {jobs.length === 0 ? (
        <p>No applied jobs found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Title</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Company</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Location</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textTransform: 'capitalize', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Date Applied</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{job.title}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{job.company}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{job.location}</td>
                <td style={{ border: '1px solid #ddd', padding: 8, textTransform: 'capitalize' }}>{job.status}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{formatDate(job.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobsAppliedPage;
