import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Job } from '../types';

const JobFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [job, setJob] = useState<Job>({
    role: '',
    companyName: '',
    status: 'Applied',
    dateApplied: '',
    details: '',
    description: '',
  });

  useEffect(() => {
    if (isEditing && id) {
      const storedJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
      const existingJob = storedJobs.find(j => j.id === Number(id));
      if (existingJob) {
        setJob(existingJob);
      }
    }
  }, [isEditing, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');

    if (isEditing && id) {
      const updatedJobs = storedJobs.map(j =>
        j.id === Number(id) ? { ...job, id: Number(id) } : j
      );
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    } else {
      const newJob: Job = {
        ...job,
        id: Date.now(),
      };
      storedJobs.push(newJob);
      localStorage.setItem('jobs', JSON.stringify(storedJobs));
    }

    // ✅ Redirect to home instead of jobs
    navigate('/home');
  };

  return (
    <div className="job-form-container">
      <h2>{isEditing ? 'Edit Job' : 'Add New Job'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={job.role}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={job.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Status:</label>
          <select name="status" value={job.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Rejected">Rejected</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        <div>
          <label>Date Applied:</label>
          <input
            type="date"
            name="dateApplied"
            value={job.dateApplied}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Details:</label>
          <textarea
            name="details"
            value={job.details}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">{isEditing ? 'Update Job' : 'Add Job'}</button>
      </form>
    </div>
  );
};

export default JobFormPage;
