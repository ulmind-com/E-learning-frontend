import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, Calendar, FileText, Link as LinkIcon, ExternalLink, CheckCircle2 } from 'lucide-react';
import PremiumBg from '../components/PremiumBg';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const AdminTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch all tasks and filter to be safe, since a specific /:id endpoint might not exist
      const res = await axios.get(`${API_URL}/internship/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const foundTask = res.data.find(t => t._id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError('Task not found');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative text-white" style={{ backgroundColor: '#050505' }}>
        <PremiumBg />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col w-full h-full">
          <div className="flex items-center space-x-4 mb-10 w-full" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out` }}>
            <div className="w-12 h-12 rounded-[16px] bg-white/10"></div>
            <div className="flex flex-col gap-2">
              <div className="w-32 h-3 bg-white/10 rounded"></div>
              <div className="w-48 h-8 bg-white/10 rounded"></div>
            </div>
          </div>
          <div className="w-full h-[600px] rounded-[32px] bg-white/5 border border-white/10" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out 0.2s` }}></div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen relative text-white flex items-center justify-center" style={{ backgroundColor: '#050505' }}>
        <PremiumBg />
        <div className="text-center relative z-10 p-12 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Task Not Found'}</h2>
          <button onClick={() => navigate('/admin/tasks')} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white" style={{ backgroundColor: '#050505' }}>
      <PremiumBg />
      
      {/* Immersive Edge Glows */}
      <div className="fixed top-0 left-0 w-[200px] h-full bg-gradient-to-r from-[#E87C41]/10 to-transparent pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[200px] h-full bg-gradient-to-l from-[#E87C41]/10 to-transparent pointer-events-none z-0"></div>
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E87C41]/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col min-h-screen animate-fade-in">
        
        {/* Header Navigation */}
        <div className="flex items-center space-x-4 mb-10">
          <button
            onClick={() => {
              navigate('/admin/tasks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-3 rounded-[16px] bg-[#111111] hover:bg-[#1a1a1a] transition-all border border-white/10 group shadow-lg"
          >
            <ArrowLeft className="h-6 w-6 text-white group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold tracking-widest text-[#E87C41] uppercase mb-1">Internship Task</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Task Details</h1>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-8 w-full animate-scale-in" style={{ animationDelay: '0.1s' }}>
          
          {/* Huge Main Card */}
          <div className="rounded-[32px] p-8 md:p-12 bg-[#0a0a0a] border border-[#E87C41]/30 shadow-[0_20px_60px_rgba(232,124,65,0.08)] relative overflow-hidden group">
            
            {/* Ambient inner card glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#E87C41]/15 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              
              {/* Task Icon / Graphic */}
              <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-[24px] bg-[#E87C41]/10 border border-[#E87C41]/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <FileText className="h-10 w-10 text-[#E87C41] drop-shadow-[0_0_15px_rgba(232,124,65,0.8)]" />
              </div>

              {/* Task Title & Details */}
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full text-[13px] font-bold bg-[#27C93F]/10 text-[#27C93F] border border-[#27C93F]/20 flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Active Task
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-[13px] font-bold bg-white/5 text-white/50 border border-white/10 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    ID: {task._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight tracking-wide">{task.title}</h2>
                
                <div className="p-6 rounded-[24px] bg-[#111115] border border-white/5">
                  <h3 className="text-[15px] font-bold text-white/50 mb-3 tracking-widest uppercase">Description & Requirements</h3>
                  <p className="text-[16px] md:text-[18px] leading-relaxed text-white/80 whitespace-pre-line font-medium">
                    {task.details}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 relative z-10"></div>
            
            {/* Action Area */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center space-x-3 text-white/50">
                <LinkIcon className="w-5 h-5" />
                <span className="text-[15px] font-medium">External Resources</span>
              </div>
              
              {task.referalLink ? (
                <a 
                  href={task.referalLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto px-8 py-4 rounded-[14px] font-bold text-[16px] text-[#E87C41] border-2 border-[#E87C41] bg-transparent flex items-center justify-center gap-2 group/btn btn-sweep-transparent"
                >
                  <span className="relative z-10">Open Reference Material</span>
                  <ExternalLink className="w-5 h-5 relative z-10 transition-transform" />
                </a>
              ) : (
                <div className="px-6 py-3 rounded-[16px] bg-white/5 border border-white/10 text-white/40 text-[14px] font-bold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  No external link provided
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskDetails;
