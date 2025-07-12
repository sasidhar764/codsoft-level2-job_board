import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';
import './Navbar.css'; // Import the CSS file

// Generic large modal
function Modal({ children, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        padding: 48,
        borderRadius: 12,
        minWidth: 400,
        maxWidth: 500,
        width: '90vw',
        position: 'relative',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)'
      }}>
        <button onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, border: 'none',
            background: 'none', fontSize: 28, fontWeight: 'bold', color: '#888', cursor: 'pointer'
          }} aria-label="Close modal">&times;</button>
        {children}
      </div>
    </div>
  );
}

// Jobseeker login/signup modal
function JobseekerAuthModal({ onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isSignup) {
        res = await api.post('/auth/register', {
          name: form.name || form.email.split('@')[0],
          email: form.email,
          password: form.password,
          role: 'candidate'
        });
      } else {
        res = await api.post('/auth/login', {
          email: form.email,
          password: form.password
        });
      }
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      onLoginSuccess(user, token);
      onClose();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login/Signup failed. Try again.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: 24 }}>{isSignup ? "Jobseeker Signup" : "Jobseeker Login"}</h3>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            className="form-control mb-3"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary mb-3" type="submit" style={{ width: "100%" }}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
        {msg && <div className="alert alert-danger">{msg}</div>}
      </form>
      <div style={{ textAlign: 'center' }}>
        {isSignup
          ? <>Already have an account? <button type="button" className="btn btn-link p-0" onClick={() => setIsSignup(false)}>Login</button></>
          : <>Don't have an account? <button type="button" className="btn btn-link p-0" onClick={() => setIsSignup(true)}>Sign up</button></>
        }
      </div>
    </Modal>
  );
}

// Employer login/signup modal
function EmployerAuthModal({ onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isSignup) {
        res = await api.post('/auth/register', {
          name: form.name || form.email.split('@')[0],
          email: form.email,
          password: form.password,
          role: 'employer'
        });
      } else {
        res = await api.post('/auth/login', {
          email: form.email,
          password: form.password
        });
      }
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      onLoginSuccess(user, token);
      onClose();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login/Signup failed. Try again.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: 24 }}>{isSignup ? "Employer Signup" : "Employer Login"}</h3>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            className="form-control mb-3"
            name="name"
            placeholder="Company Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          className="form-control mb-3"
          name="email"
          placeholder="Company Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary mb-3" type="submit" style={{ width: "100%" }}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
        {msg && <div className="alert alert-danger">{msg}</div>}
      </form>
      <div style={{ textAlign: 'center' }}>
        {isSignup
          ? <>Already have an account? <button type="button" className="btn btn-link p-0" onClick={() => setIsSignup(false)}>Login</button></>
          : <>Don't have an account? <button type="button" className="btn btn-link p-0" onClick={() => setIsSignup(true)}>Sign up</button></>
        }
      </div>
    </Modal>
  );
}

export default function Navbar({ user, logout, login }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [showJobseekerAuth, setShowJobseekerAuth] = useState(false);
  const [showEmployerAuth, setShowEmployerAuth] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="JobBoard Logo"
            style={{
              height: '36px',
              width: '36px',
              marginRight: '10px',
              objectFit: 'contain',
              borderRadius: '50%',
              background: '#fff'
            }}
          />
          <span style={{
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>
            JobBoard
          </span>
        </Link>
        <div className="navbar-nav">
          {user && (
            <Link 
              className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} 
              to="/jobs"
            >
              Jobs
            </Link>
          )}
          {user && (
            <Link 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
              to="/dashboard"
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'employer' && (
            <Link 
              className={`nav-link ${isActive('/post-job') ? 'active' : ''}`} 
              to="/post-job"
            >
              Post Job
            </Link>
          )}
          {user ? (
            <button className="btn btn-link nav-link" style={{ padding: 0 }} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button
                type="button"
                className="nav-link btn btn-link"
                style={{ padding: 0 }}
                onClick={() => setShowJobseekerAuth(true)}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  marginLeft: '10px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  padding: '8px 28px',
                  fontSize: '1.1rem'
                }}
                onClick={() => setShowEmployerAuth(true)}
              >
                Post Job
              </button>
            </>
          )}
        </div>
      </div>
      {showJobseekerAuth && (
        <JobseekerAuthModal
          onClose={() => setShowJobseekerAuth(false)}
          onLoginSuccess={(user, token) => {
            login(user, token);
            setShowJobseekerAuth(false);
            navigate('/jobs');
          }}
        />
      )}
      {showEmployerAuth && (
        <EmployerAuthModal
          onClose={() => setShowEmployerAuth(false)}
          onLoginSuccess={(user, token) => {
            login(user, token);
            setShowEmployerAuth(false);
            navigate('/dashboard');
          }}
        />
      )}
    </nav>
  );
}
