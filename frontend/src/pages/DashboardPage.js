import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './DashboardPage.css';

export default function DashboardPage({ user }) {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    console.log('DashboardPage: Fetching /user/dashboard for user:', user);
    api.get('/user/dashboard')
      .then(res => {
        console.log('DashboardPage: Data received from API:', res.data);
        setData(res.data);
      })
      .catch(err => {
        setMsg(err.response?.data?.msg || 'Error loading dashboard');
        console.error('DashboardPage: Fetch error:', err);
      });
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  if (msg) {
    console.warn('DashboardPage: Displaying error message:', msg);
    return (
      <div className="dashboard-page-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-error">{msg}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    console.log('DashboardPage: Waiting for data...');
    return (
      <div className="dashboard-page-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (data.role === 'employer') {
    return (
      <div className="dashboard-page-wrapper">
        <div className="dashboard-container">
          {/* User Header */}
          <div className="dashboard-header">
            <div className="dashboard-user-info">
              <div className="dashboard-user-avatar">
                {getUserInitials(user?.name)}
              </div>
              <div className="dashboard-user-details">
                <h1>Welcome back, {user?.name || 'Employer'}!</h1>
                <div className="dashboard-user-role">Employer</div>
                <p className="dashboard-user-email">{user?.email}</p>
              </div>
            </div>
            <div className="dashboard-stats">
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-number">{data.jobs.length}</div>
                <div className="dashboard-stat-label">Posted Jobs</div>
              </div>
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-number">
                  {data.jobs.reduce((total, job) => total + job.applications.length, 0)}
                </div>
                <div className="dashboard-stat-label">Total Applications</div>
              </div>
            </div>
          </div>

          {/* Jobs Content */}
          <div className="dashboard-content">
            <h2 className="dashboard-section-title">Your Posted Jobs</h2>
            {data.jobs.length === 0 ? (
              <div className="dashboard-empty-state">
                <div className="dashboard-empty-icon">📋</div>
                <p className="dashboard-empty-text">No jobs posted yet. Start by posting your first job!</p>
              </div>
            ) : (
              <div className="dashboard-cards-grid">
                {data.jobs.map(job => (
                  <div className="dashboard-job-card" key={job._id}>
                    <h3 className="dashboard-job-title">{job.title}</h3>
                    <div className="dashboard-job-meta">
                      <div className="dashboard-job-meta-item">
                        <span className="dashboard-job-meta-icon">🏢</span>
                        <span>{job.company}</span>
                      </div>
                      <div className="dashboard-job-meta-item">
                        <span className="dashboard-job-meta-icon">📍</span>
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="dashboard-job-meta-item">
                          <span className="dashboard-job-meta-icon">💰</span>
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                    <div className="dashboard-job-applications">
                      <span className="dashboard-applications-count">
                        {job.applications.length} Applications
                      </span>
                      <span className="dashboard-applications-label">
                        {job.applications.length === 1 ? 'Application' : 'Applications'} received
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="dashboard-page-wrapper">
        <div className="dashboard-container">
          {/* User Header */}
          <div className="dashboard-header">
            <div className="dashboard-user-info">
              <div className="dashboard-user-avatar">
                {getUserInitials(user?.name)}
              </div>
              <div className="dashboard-user-details">
                <h1>Welcome back, {user?.name || 'Job Seeker'}!</h1>
                <div className="dashboard-user-role">Job Seeker</div>
                <p className="dashboard-user-email">{user?.email}</p>
              </div>
            </div>
            <div className="dashboard-stats">
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-number">{data.applications.length}</div>
                <div className="dashboard-stat-label">Applications</div>
              </div>
            </div>
          </div>

          {/* Applications Content */}
          <div className="dashboard-content">
            <h2 className="dashboard-section-title">Jobs You've Applied To</h2>
            {data.applications.length === 0 ? (
              <div className="dashboard-empty-state">
                <div className="dashboard-empty-icon">💼</div>
                <p className="dashboard-empty-text">You haven't applied to any jobs yet. Start exploring opportunities!</p>
              </div>
            ) : (
              <div className="dashboard-cards-grid">
                {data.applications.map(job => (
                  <div className="dashboard-job-card" key={job._id}>
                    <h3 className="dashboard-job-title">{job.title}</h3>
                    <div className="dashboard-job-meta">
                      <div className="dashboard-job-meta-item">
                        <span className="dashboard-job-meta-icon">🏢</span>
                        <span>{job.company}</span>
                      </div>
                      <div className="dashboard-job-meta-item">
                        <span className="dashboard-job-meta-icon">📍</span>
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="dashboard-job-meta-item">
                          <span className="dashboard-job-meta-icon">💰</span>
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                    {job.employer && (
                      <div className="dashboard-employer-info">
                        <p className="dashboard-employer-name">{job.employer.name}</p>
                        <p className="dashboard-employer-email">{job.employer.email}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
