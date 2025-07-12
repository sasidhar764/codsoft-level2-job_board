import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import './JobDetailPage.css';

export default function JobDetailPage({ user }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    console.log('Fetching job details for ID:', id);
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Loading job details...', {
      position: "top-right"
    });

    api.get(`/jobs/${id}`)
      .then(res => {
        console.log('Job fetched:', res.data);
        setJob(res.data);
        setLoading(false);
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Job details loaded successfully!', {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch(err => {
        console.error('Error fetching job:', err);
        setMsg(err.response?.data?.msg || 'Error loading job details');
        setLoading(false);
        
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        toast.error('Failed to load job details. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }, [id]);

  const apply = async e => {
    e.preventDefault();
    
    if (!file) {
      setMsg('Please upload your resume');
      toast.error('📄 Please upload your resume to continue', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    
    setApplying(true);
    const formData = new FormData();
    formData.append('resume', file);
    
    // Show applying toast
    const applyingToast = toast.loading('Submitting your application...', {
      position: "top-right"
    });
    
    try {
      console.log('Submitting job application...');
      const response = await api.post(`/jobs/${id}/apply`, formData);
      console.log('Application response:', response.data);
      
      setMsg('Applied successfully! The employer has been notified via email.');
      setFile(null);
      setHasApplied(true);
      
      // Clear the file input
      const fileInput = document.querySelector('.job-detail-file-input');
      if (fileInput) fileInput.value = '';
      
      // Dismiss applying toast and show success
      toast.dismiss(applyingToast);
      
      if (response.data.emailSent) {
        toast.success('🎉 Application submitted! Employer notified via email.', {
          position: "top-right",
          autoClose: 6000,
        });
      } else {
        toast.success('✅ Application submitted successfully!', {
          position: "top-right",
          autoClose: 5000,
        });
        toast.warning('⚠️ Email notification may have failed, but your application was saved.', {
          position: "top-right",
          autoClose: 7000,
        });
      }
      
      console.log('Job application submitted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Error applying for job';
      setMsg(errorMsg);
      
      // Dismiss applying toast and show error
      toast.dismiss(applyingToast);
      
      if (errorMsg.includes('Already applied')) {
        toast.info('📋 You have already applied for this position', {
          position: "top-right",
          autoClose: 5000,
        });
        setHasApplied(true);
      } else {
        toast.error(`❌ ${errorMsg}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
      
      console.error('Error applying for job:', err);
    } finally {
      setApplying(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      toast.info(`📎 Resume selected: ${selectedFile.name}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="job-detail-page-wrapper">
        <div className="job-detail-container">
          <div className="job-detail-loading">
            <ClipLoader color="#2196f3" size={50} />
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-detail-page-wrapper">
        <div className="job-detail-container">
          <Link to="/jobs" className="job-detail-back-btn">← Back to Jobs</Link>
          <div className="job-detail-message error">
            {msg || 'Job not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page-wrapper">
      <div className="job-detail-container">
        <Link to="/jobs" className="job-detail-back-btn">← Back to Jobs</Link>
        
        <div className="job-detail-card">
          <div className="job-detail-header">
            <h1 className="job-detail-title">{job.title}</h1>
            <p className="job-detail-company">{job.company}</p>
          </div>
          
          <div className="job-detail-content">
            <div className="job-detail-meta">
              <div className="job-detail-meta-item">
                <p className="job-detail-meta-label">Location</p>
                <p className="job-detail-meta-value">{job.location || 'Not specified'}</p>
              </div>
              <div className="job-detail-meta-item">
                <p className="job-detail-meta-label">Salary</p>
                <p className="job-detail-meta-value">{job.salary || 'Not specified'}</p>
              </div>
              <div className="job-detail-meta-item">
                <p className="job-detail-meta-label">Category</p>
                <p className="job-detail-meta-value">{job.category || 'Not specified'}</p>
              </div>
              <div className="job-detail-meta-item">
                <p className="job-detail-meta-label">Posted By</p>
                <p className="job-detail-meta-value">{job.employer?.name || 'Unknown'}</p>
              </div>
            </div>

            <div className="job-detail-description">
              <h3 className="job-detail-description-title">Job Description</h3>
              <p className="job-detail-description-text">{job.description || 'No description provided.'}</p>
            </div>

            {user?.role === 'candidate' && !hasApplied && (
              <div className="job-detail-apply-section">
                <h3 className="job-detail-apply-title">Apply for this Position</h3>
                <div className="email-notification-info">
                  <div className="notification-badge">
                    <span className="notification-icon">📧</span>
                    <div className="notification-text">
                      <strong>Instant Notification:</strong> The employer will receive an immediate email notification when you submit your application.
                    </div>
                  </div>
                </div>
                <form onSubmit={apply} className="job-detail-apply-form">
                  <div className="file-upload-container">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="job-detail-file-input" 
                      onChange={handleFileChange}
                      required
                      disabled={applying}
                    />
                    <div className="file-upload-hint">
                      Accepted formats: PDF, DOC, DOCX (Max 5MB)
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="job-detail-apply-btn"
                    disabled={applying || !file}
                  >
                    {applying ? (
                      <>
                        <ClipLoader color="#fff" size={16} />
                        <span style={{ marginLeft: '8px' }}>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ marginRight: '8px' }}>📤</span>
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {user?.role === 'candidate' && hasApplied && (
              <div className="job-detail-apply-section applied">
                <h3 className="job-detail-apply-title">Application Status</h3>
                <div className="application-status">
                  <span className="status-icon">✅</span>
                  <div className="status-text">
                    <strong>Application Submitted!</strong>
                    <p>You have successfully applied for this position. The employer has been notified.</p>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'employer' && (
              <div className="job-detail-apply-section">
                <h3 className="job-detail-apply-title">Employer View</h3>
                <div className="employer-info">
                  <span className="info-icon">👔</span>
                  <p>You are viewing this job as an employer. Only candidates can apply for jobs.</p>
                  <Link to="/dashboard" className="dashboard-link">
                    View Applications in Dashboard →
                  </Link>
                </div>
              </div>
            )}

            {!user && (
              <div className="job-detail-apply-section">
                <h3 className="job-detail-apply-title">Want to Apply?</h3>
                <div className="login-prompt">
                  <span className="prompt-icon">🔐</span>
                  <p>Please <Link to="/login" className="login-link">login</Link> as a candidate to apply for this job.</p>
                </div>
              </div>
            )}

            {msg && (
              <div className={`job-detail-message ${msg.includes('successfully') ? 'success' : 'error'}`}>
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
