import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage({ login }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      console.log('Register attempt with:', form.email, 'as', form.role);
      const { data } = await api.post('/auth/register', form);
      console.log('Registration successful:', data.user);
      login(data.user, data.token);
      navigate('/jobs');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
      console.error('RegisterPage error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input name="name" className="form-control mb-2" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" className="form-control mb-2" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" className="form-control mb-2" value={form.role} onChange={handleChange}>
          <option value="candidate">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button className="btn btn-primary">Register</button>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
    </div>
  );
}
