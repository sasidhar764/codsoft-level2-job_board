import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PostJobPage from './pages/PostJobPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom hook for authentication state
function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return { user, token, login, logout };
}

function App() {
  const { user, login, logout } = useAuth();

  return (
    <BrowserRouter>
      {/* Pass login to Navbar for modal-based login/signup */}
      <Navbar user={user} logout={logout} login={login} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />

        <Route path="/jobs" element={<JobsPage user={user} />} />
        <Route path="/jobs/:id" element={<JobDetailPage user={user} />} />

        {/* Page-based login/signup routes (optional if you use only modals) */}
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/register" element={<RegisterPage login={login} />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <LoginPage login={login} />} />
        <Route path="/post-job" element={user?.role === 'employer' ? <PostJobPage /> : <LoginPage login={login} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
