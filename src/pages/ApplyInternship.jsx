import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, CheckCircle2, User, Mail, Phone, Building2, GraduationCap, Code2, Globe, Link as LinkIcon, ChevronLeft, Loader2 } from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const ApplyInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [internship, setInternship] = useState(null);
  const [fetchingInternship, setFetchingInternship] = useState(true);

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

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internship/list/${id}`);
        setInternship(data);
      } catch (err) {
        setError('Failed to load internship details');
      } finally {
        setFetchingInternship(false);
      }
    };
    if (id) fetchInternship();
    window.scrollTo(0, 0);
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/internship/apply`, { ...formData, internshipId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/my-application');
    } catch (err) {
      setError(err.response?.data?.message || 'Error applying for internship');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingInternship) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#E87C41]" />
      </div>
    );
  }

  const InputField = ({ label, name, type = 'text', required = false, placeholder, icon: Icon, isFullWidth = false }) => (
    <div className={`group ${isFullWidth ? 'sm:col-span-2' : ''}`}>
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider transition-colors duration-300 group-focus-within:text-[#E87C41]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]">
        <div className="absolute left-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#E87C41] transition-colors duration-300">
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <input 
          name={name} 
          type={type} 
          required={required} 
          value={formData[name]} 
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3.5 rounded-xl border border-white/10 placeholder-gray-600 text-white bg-[#111] focus:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E87C41]/30 focus:border-[#E87C41] sm:text-sm transition-all duration-300 shadow-sm`} 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.02] blur-[120px] pointer-events-none animate-pulse" style={{ backgroundColor: '#E87C41' }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.01] blur-[120px] pointer-events-none" style={{ backgroundColor: '#E87C41', animationDelay: '2s' }}></div>
      
      {/* Back button */}
      <div className="w-full max-w-3xl mb-6 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[#E87C41] transition-colors w-fit">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-bold text-sm uppercase tracking-wider">Back</span>
        </button>
      </div>

      <div className="relative max-w-3xl w-full space-y-8 bg-[#0a0a0a] p-8 sm:p-14 rounded-[2.5rem] shadow-[0_0_50px_rgba(232,124,65,0.05)] border border-white/10 backdrop-blur-xl animate-slide-up">
        
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E87C41]/10 mb-6 animate-bounce-subtle border border-[#E87C41]/20">
              <GraduationCap className="h-8 w-8 text-[#E87C41]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Apply for Internship
            </h2>
            <h3 className="text-xl text-[#E87C41] font-bold mb-4">{internship?.title}</h3>
            <p className="text-sm text-gray-400 font-medium max-w-xl mx-auto">
              Please fill out your details carefully. Our team will review your application and get back to you shortly.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center flex items-center justify-center gap-2 mb-8">
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
              <InputField label="LinkedIn Profile" name="linkedin" type="url" icon={LinkIcon} placeholder="https://linkedin.com/in/..." />
              <InputField label="GitHub Profile" name="github" type="url" icon={Globe} placeholder="https://github.com/..." />
              <InputField label="Portfolio URL" name="portfolio" type="url" icon={Globe} isFullWidth placeholder="https://myportfolio.com" />
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-black uppercase tracking-wider rounded-2xl text-black bg-[#E87C41] transition-all duration-500 hover:shadow-[0_0_30px_rgba(232,124,65,0.4)] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Submitting...
                    </span>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </span>
                {/* Glare effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              <p className="text-center text-xs text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#E87C41]" />
                Your information is securely encrypted and submitted directly.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyInternship;

