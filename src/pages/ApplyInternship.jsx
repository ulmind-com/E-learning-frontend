import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, CheckCircle2, User, Mail, Phone, Building2, GraduationCap, Code2, Globe, Link } from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

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

  const InputField = ({ label, name, type = 'text', required = false, placeholder, icon: Icon, isFullWidth = false }) => (
    <div className={`group ${isFullWidth ? 'sm:col-span-2' : ''}`}>
      <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider transition-colors duration-300 group-focus-within:text-[var(--accent)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative relative flex items-center transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]">
        <div className="absolute left-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors duration-300">
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <input 
          name={name} 
          type={type} 
          required={required} 
          value={formData[name]} 
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3.5 rounded-xl border border-[var(--border-color)] placeholder-[var(--text-muted)] text-[var(--text-primary)] bg-[var(--bg-primary)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow-strong)] focus:border-[var(--accent)] sm:text-sm transition-all duration-300 shadow-sm`} 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[var(--bg-secondary)] to-transparent opacity-50"></div>
      
      <div className="relative max-w-3xl w-full space-y-8 bg-[var(--bg-card)] p-8 sm:p-14 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[var(--border-color)] backdrop-blur-xl animate-slide-up overflow-hidden">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.15] animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#10b981] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.1] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-glow)] mb-6 animate-bounce-subtle">
              <GraduationCap className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
              Internship Application
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
              Start your journey with us. Please fill out your details carefully to proceed to the next step.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-center flex items-center justify-center gap-2 animate-shake mb-8">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
              <InputField label="Full Name" name="name" icon={User} required placeholder="John Doe" />
              <InputField label="Email Address" name="email" type="email" icon={Mail} required placeholder="john@example.com" />
              <InputField label="Phone Number" name="phone" type="tel" icon={Phone} required placeholder="+1234567890" />
              <InputField label="College/University" name="college" icon={Building2} required placeholder="University of Technology" />
              <InputField label="Degree & Major" name="degree" icon={GraduationCap} required isFullWidth placeholder="B.Tech in Computer Science" />
              <InputField label="Key Skills (comma separated)" name="skills" icon={Code2} required isFullWidth placeholder="React, Node.js, Python, TypeScript..." />
              <InputField label="LinkedIn Profile" name="linkedin" type="url" icon={Link} placeholder="https://linkedin.com/in/..." />
              <InputField label="GitHub Profile" name="github" type="url" icon={Globe} placeholder="https://github.com/..." />
              <InputField label="Portfolio URL" name="portfolio" type="url" icon={Globe} isFullWidth placeholder="https://myportfolio.com" />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-[var(--accent)] hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-all duration-500 hover:shadow-[0_8px_30px_var(--accent-glow-strong)] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </span>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </span>
                {/* Elegant Button Glare Animation */}
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
              </button>
              <p className="text-center text-xs text-[var(--text-muted)] mt-4 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Your information is securely encrypted and submitted directly to the HR team.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyInternship;

