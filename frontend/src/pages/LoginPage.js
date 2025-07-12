import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage({ login }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from "Post Job" button
  const isFromPostJob = location.state?.from === 'post-job';

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      console.log('Login attempt with:', form.email);
      const { data } = await api.post('/auth/login', form);
      console.log('Login successful:', data.user);
      login(data.user, data.token);

      // Role-based redirection
      if (data.user.role === 'employer') {
        if (isFromPostJob) {
          navigate('/post-job');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
      console.error('LoginPage error:', err);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Login to JobBoard</h2>
            {isFromPostJob && (
              <div className="login-intent">
                <span className="intent-icon">💼</span>
                <span>Login as an Employer to Post Jobs</span>
              </div>
            )}
          </div>
          
          <form onSubmit={submit} className="login-form">
            <input 
              name="email" 
              className="login-input" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="password" 
              type="password" 
              className="login-input" 
              placeholder="Password" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />
            <button className="login-btn" type="submit">
              {isFromPostJob ? 'Login to Post Job' : 'Login'}
            </button>
          </form>
          
          {msg && <div className="login-message error">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
