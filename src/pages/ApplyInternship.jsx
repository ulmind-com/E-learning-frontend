import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, CheckCircle2, User, Mail, Phone, Building2, GraduationCap, Code2, Globe, Link as LinkIcon, ChevronLeft, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

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
      <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.15em] transition-colors duration-300 group-focus-within:text-[#E87C41]">
        {label} {required && <span className="text-[#E87C41]">*</span>}
      </label>
      <div className="relative flex items-center transition-all duration-300">
        <div className="absolute left-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors duration-300">
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        <input 
          name={name} 
          type={type} 
          required={required} 
          value={formData[name]} 
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-4 rounded-xl border border-white/5 placeholder-gray-700 text-white bg-white/[0.02] focus:bg-white/[0.05] focus:outline-none focus:border-[#E87C41]/50 text-sm transition-all duration-300`} 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden bg-[#000000]">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(232, 124, 65, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 124, 65, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px', transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-200px)', animation: 'grid-move 20s linear infinite' }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0"></div>
      
      {/* Orange Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full opacity-20 blur-[150px] pointer-events-none" style={{ backgroundColor: '#E87C41' }}></div>
      
      <div className="relative max-w-4xl w-full z-10">
        {/* Back button */}
        <div className="mb-6 flex justify-start">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#E87C41] transition-colors group">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-[0.15em]">Back</span>
          </button>
        </div>

        <div className="bg-[#050505] p-8 sm:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden group">
          {/* Subtle border glow effect */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E87C41]/50 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E87C41]/10 mb-6 border border-[#E87C41]/20">
                <GraduationCap className="h-8 w-8 text-[#E87C41]" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-3">
                Apply for Internship
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E87C41] animate-pulse"></span>
                <h3 className="text-sm sm:text-base text-[#E87C41] font-bold tracking-widest uppercase">{internship?.title}</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium max-w-xl mx-auto tracking-wide uppercase leading-relaxed">
                Please fill out your details carefully. Our team will review your application and get back to you shortly.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center flex items-center justify-center gap-2 mb-8 text-sm font-semibold tracking-wide">
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
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

              <div className="pt-8 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-5 px-6 border border-transparent text-sm font-black uppercase tracking-[0.2em] rounded-xl text-black bg-[#E87C41] transition-all duration-500 hover:shadow-[0_0_30px_rgba(232,124,65,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
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
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </>
                    )}
                  </span>
                  {/* Glare effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-6 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E87C41]" />
                  Your information is securely encrypted
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyInternship;

