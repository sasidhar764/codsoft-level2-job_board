import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './JobsPage.css'; // Import your CSS

export default function JobsPage({ user }) {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      api.get(`/jobs?q=${q}`).then(res => setJobs(res.data));
    }
  }, [q, user]);

  if (!user) {
    return (
      <div className="jobs-container-job">
        <h2 className="jobs-title-job">Please log in to view job listings.</h2>
        <button className="job-details-btn-job" onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  return (
    <div className="jobs-container-job">
      <h2 className="jobs-title-job">Job Listings</h2>
      <input
        className="jobs-search-job"
        placeholder="Search jobs..."
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <div className="jobs-row-job">
        {jobs.map(job => (
          <div className="job-card-job" key={job._id}>
            <div>
              <div className="job-title-job">{job.title}</div>
              <div className="job-meta-job">{job.company} - {job.location}</div>
            </div>
            <Link to={`/jobs/${job._id}`} className="job-details-btn-job">Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
