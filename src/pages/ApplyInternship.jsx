import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ApplyInternship = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/internship/apply`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/my-application');
    } catch (err) {
      setError(err.response?.data?.message || 'Error applying for internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="max-w-2xl w-full space-y-8 bg-[var(--bg-secondary)] p-10 rounded-2xl shadow-2xl border border-[var(--border-color)]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--text-primary)]">
            Apply for Internship
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Fill out your resume details below to get started.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-center animate-shake">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name *</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address *</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone Number *</label>
              <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">College/University *</label>
              <input name="college" type="text" required value={formData.college} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="University of XYZ" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Degree & Major *</label>
              <input name="degree" type="text" required value={formData.degree} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="B.Tech in Computer Science" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Key Skills (comma separated) *</label>
              <input name="skills" type="text" required value={formData.skills} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="React, Node.js, Python..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">LinkedIn URL</label>
              <input name="linkedin" type="url" value={formData.linkedin} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">GitHub URL</label>
              <input name="github" type="url" value={formData.github} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="https://github.com/..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Portfolio URL</label>
              <input name="portfolio" type="url" value={formData.portfolio} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--bg-primary)] sm:text-sm transition-all duration-300" placeholder="https://myportfolio.com" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--accent)] hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternship;
