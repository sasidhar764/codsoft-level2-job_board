import React, { useState } from 'react';
import api from '../api/axios';
import './PostJobPage.css';

export default function PostJobPage() {
  const [form, setForm] = useState({ 
    title: '', 
    company: '', 
    description: '', 
    location: '', 
    category: '', 
    salary: '' 
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      console.log('Posting job with form data:', form);
      const response = await api.post('/jobs', form);
      console.log('Job posted successfully:', response.data);
      setMsg('Job posted successfully! Your job listing is now live.');
      setForm({ title: '', company: '', description: '', location: '', category: '', salary: '' });
    } catch (err) {
      console.error('Error posting job:', err);
      setMsg(err.response?.data?.msg || 'Error posting job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Technology',
    'Marketing',
    'Sales',
    'Design',
    'Finance',
    'Human Resources',
    'Operations',
    'Customer Service',
    'Engineering',
    'Healthcare',
    'Education',
    'Other'
  ];

  return (
    <div className="post-job-page-wrapper">
      <div className="post-job-container">
        <div className="post-job-card">
          <div className="post-job-header">
            <h1 className="post-job-title">Post a New Job</h1>
            <p className="post-job-subtitle">Find the perfect candidate for your team</p>
          </div>
          
          <div className="post-job-form-container">
            <div className="post-job-tips">
              <h3 className="post-job-tips-title">
                <span>💡</span>
                Tips for a Great Job Posting
              </h3>
              <ul className="post-job-tips-list">
                <li>Write a clear, descriptive job title</li>
                <li>Include specific requirements and qualifications</li>
                <li>Mention salary range and benefits</li>
                <li>Describe your company culture</li>
              </ul>
            </div>

            <form onSubmit={submit} className="post-job-form">
              <div className="post-job-form-row">
                <div className="post-job-form-group">
                  <label className="post-job-label">
                    <span className="post-job-label-icon">💼</span>
                    Job Title
                  </label>
                  <input 
                    type="text"
                    name="title"
                    className="post-job-input"
                    placeholder="e.g. Senior Software Engineer"
                    value={form.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="post-job-form-group">
                  <label className="post-job-label">
                    <span className="post-job-label-icon">🏢</span>
                    Company Name
                  </label>
                  <input 
                    type="text"
                    name="company"
                    className="post-job-input"
                    placeholder="e.g. Tech Solutions Inc."
                    value={form.company} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="post-job-form-row">
                <div className="post-job-form-group">
                  <label className="post-job-label">
                    <span className="post-job-label-icon">📍</span>
                    Location
                  </label>
                  <input 
                    type="text"
                    name="location"
                    className="post-job-input"
                    placeholder="e.g. New York, NY or Remote"
                    value={form.location} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="post-job-form-group">
                  <label className="post-job-label">
                    <span className="post-job-label-icon">💰</span>
                    Salary Range
                  </label>
                  <input 
                    type="text"
                    name="salary"
                    className="post-job-input"
                    placeholder="e.g. $80,000 - $120,000"
                    value={form.salary} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="post-job-form-group">
                <label className="post-job-label">
                  <span className="post-job-label-icon">📂</span>
                  Category
                </label>
                <select 
                  name="category"
                  className="post-job-select"
                  value={form.category} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="post-job-form-group full-width">
                <label className="post-job-label">
                  <span className="post-job-label-icon">📝</span>
                  Job Description
                </label>
                <textarea 
                  name="description"
                  className="post-job-input post-job-textarea"
                  placeholder="Describe the role, responsibilities, requirements, and what makes your company great..."
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="post-job-submit-container">
                <button 
                  type="submit" 
                  className="post-job-submit-btn" 
                  disabled={loading}
                >
                  {loading && <span className="post-job-loading-spinner"></span>}
                  {loading ? 'Posting Job...' : 'Post Job'}
                </button>
              </div>
            </form>

            {msg && (
              <div className={`post-job-message ${msg.includes('successfully') ? 'success' : 'error'}`}>
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
