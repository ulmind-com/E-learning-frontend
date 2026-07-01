import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, PlusCircle, ExternalLink, Link as LinkIcon, FileText, CheckCircle2, Loader2, ListTodo, ArrowLeft, X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PremiumBg from '../components/PremiumBg';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', details: '', referalLink: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const navigate = useNavigate();

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/internship/tasks/${deletingTaskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeletingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setPageLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/internship/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/internship/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', details: '', referalLink: '' });
      fetchTasks();
    } catch (err) {
      alert('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white" >
      <PremiumBg />


      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex flex-col min-h-screen animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                navigate('/admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 mr-2"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <div className="p-3 rounded-2xl bg-[#E87C41]/10 border border-[#E87C41]/20 shadow-inner">
              <ListTodo className="h-7 w-7 text-[#E87C41]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Manage Tasks</h1>
              <p className="text-[15px] font-medium mt-1 text-white/50">Create and organize internship assignments</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 px-5 py-2.5 rounded-full font-bold text-[14px] inline-flex items-center space-x-2 bg-white/5 border border-white/10 text-white/80 shadow-sm">
            <ClipboardList className="h-4 w-4 text-[#E87C41]" />
            <span>{tasks.length} Active Tasks</span>
          </div>
        </div>

        {pageLoading ? (
          <div className="flex flex-col lg:flex-row gap-8 pb-12 w-full mt-6">
            <div className="lg:w-2/3 space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="rounded-[24px] p-7 bg-white/5 border border-white/10 h-[220px]" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out ${i * 0.1}s` }}>
                     <div className="flex space-x-2 mb-6">
                       <div className="w-3 h-3 rounded-full bg-white/10"></div>
                       <div className="w-3 h-3 rounded-full bg-white/10"></div>
                       <div className="w-3 h-3 rounded-full bg-white/10"></div>
                     </div>
                     <div className="w-3/4 h-6 bg-white/10 rounded mb-4"></div>
                     <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                     <div className="w-2/3 h-4 bg-white/10 rounded mb-6"></div>
                     <div className="w-8 h-8 rounded-full bg-white/10"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="rounded-[28px] p-8 h-[500px] bg-white/5 border border-white/10" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out 0.2s` }}></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 pb-12">
            
            {/* Left Column: Created Tasks Grid */}
            <div className="lg:w-2/3 order-2 lg:order-1 space-y-6">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-[#E87C41]" />
                <span>Available Task Templates</span>
              </h2>
              
              {tasks.length === 0 ? (
                <div className="p-12 rounded-[28px] border border-dashed border-white/10 text-center bg-white/5 backdrop-blur-sm">
                  <ListTodo className="h-14 w-14 mx-auto mb-4 text-white/20" />
                  <h3 className="text-xl font-bold mb-2 text-white/80">No Tasks Created</h3>
                  <p className="text-[15px] text-white/40">Use the form on the right to create your first internship task.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {tasks.map((task, index) => {
                    const isExpanded = expandedTasks[task._id];
                    const isLong = task.details.length > 150;
                    const isMinimizing = deletingTaskId === task._id;
                    
                    return (
                    <div 
                      key={task._id} 
                      className={`rounded-[24px] p-7 shadow-sm group relative overflow-hidden bg-[#050505] border border-[#E87C41]/30 flex flex-col ${!isMinimizing ? 'transition-all duration-300 hover:shadow-[0_10px_30px_rgba(232,124,65,0.15)] hover:-translate-y-1 hover:border-[#E87C41]/60 hover:bg-[#0a0a0a]' : 'z-50'}`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        ...(isMinimizing ? {
                          transform: 'perspective(1000px) translate(60vw, 60vh) scale(0.02) rotateX(85deg) rotateY(20deg) skewX(-30deg)',
                          opacity: 0,
                          pointerEvents: 'none',
                          transition: 'all 1.5s cubic-bezier(0.32, 0, 0.67, 0)'
                        } : {
                          transform: 'perspective(1000px) translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) skewX(0deg)',
                          transition: 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                        })
                      }}
                    >
                      {/* Subtle top glow line */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E87C41]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Mac OS Window Controls */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div 
                          onClick={() => { 
                            setDeletingTaskId(task._id); 
                            setTimeout(() => {
                              setShowDeleteModal(true);
                            }, 1500);
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] cursor-pointer hover:scale-[1.6] transition-all flex items-center justify-center group/red shadow-sm"
                          title="Delete Task"
                        >
                          <X className="w-2.5 h-2.5 text-black opacity-0 group-hover/red:opacity-100 transition-opacity drop-shadow-sm" strokeWidth={2} />
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-sm" title="Normal"></div>
                        <div 
                          onClick={() => {
                            navigate('/admin/task/' + task._id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-[#27C93F] cursor-pointer hover:scale-[1.6] transition-all flex items-center justify-center group/green shadow-sm"
                          title="Open Task Details"
                        >
                          <Maximize2 className="w-2 h-2 text-black opacity-0 group-hover/green:opacity-100 transition-opacity drop-shadow-sm" strokeWidth={2} />
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-white/90 transition-colors tracking-wide">{task.title}</h3>
                        <p className={`text-[14px] leading-relaxed text-white/60 transition-all ${!isExpanded ? 'line-clamp-4' : ''}`}>
                          {task.details}
                        </p>
                        {isLong && (
                          <button 
                            onClick={() => toggleTaskExpansion(task._id)}
                            className="text-[#E87C41] text-[13px] font-bold mt-2 hover:underline self-start bg-transparent border-none cursor-pointer"
                          >
                            {isExpanded ? 'Show less' : 'See more'}
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[13px] font-bold text-white/50 group-hover:bg-[#E87C41]/20 group-hover:text-[#E87C41] group-hover:border-[#E87C41]/40 transition-all shadow-inner">
                          {index + 1}
                        </div>
                        
                        {task.referalLink ? (
                          <a 
                            href={task.referalLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border border-[#E87C41]/30 bg-[#E87C41]/10 text-[#E87C41] hover:bg-[#E87C41]/20 hover:scale-105"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Reference</span>
                          </a>
                        ) : (
                          <span className="text-[13px] font-medium px-3 py-1.5 rounded-xl bg-white/5 text-white/30 border border-white/5">No Link</span>
                        )}
                      </div>
                    </div>
                  );})}
                </div>
              )}
            </div>

            {/* Right Column: Create Task Form (Sticky) */}
            <div className="lg:w-1/3 order-1 lg:order-2">
              <div className="sticky top-28 rounded-[28px] p-8 shadow-2xl overflow-hidden relative glass-panel border border-white/10">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-[0.15] pointer-events-none bg-[#E87C41]"></div>
                
                <div className="flex items-center space-x-4 mb-8 relative z-10">
                  <div className="p-3 rounded-2xl bg-[#E87C41]/10 border border-[#E87C41]/20 shadow-inner">
                    <PlusCircle className="h-6 w-6 text-[#E87C41]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div>
                    <label className="flex items-center space-x-2 text-[14px] font-bold mb-2.5 text-white/70 tracking-wide uppercase">
                      <FileText className="h-4 w-4 text-[#E87C41]" />
                      <span>Task Title</span>
                    </label>
                    <input 
                      required 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      placeholder="e.g. Build a landing page"
                      className="w-full px-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-[#E87C41]/30 focus:border-[#E87C41]/50 focus:outline-none transition-all font-medium bg-white/5 border-white/10 text-white placeholder-white/20"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2 text-[14px] font-bold mb-2.5 text-white/70 tracking-wide uppercase">
                      <ClipboardList className="h-4 w-4 text-[#E87C41]" />
                      <span>Task Details</span>
                    </label>
                    <textarea 
                      required 
                      name="details" 
                      rows="5" 
                      value={formData.details} 
                      onChange={handleChange} 
                      placeholder="Describe the requirements..."
                      className="w-full px-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-[#E87C41]/30 focus:border-[#E87C41]/50 focus:outline-none transition-all font-medium resize-none custom-scrollbar bg-white/5 border-white/10 text-white placeholder-white/20"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2 text-[14px] font-bold mb-2.5 text-white/70 tracking-wide uppercase">
                      <LinkIcon className="h-4 w-4 text-[#E87C41]" />
                      <span>Reference Link (Optional)</span>
                    </label>
                    <input 
                      name="referalLink" 
                      type="url" 
                      value={formData.referalLink} 
                      onChange={handleChange} 
                      placeholder="https://..."
                      className="w-full px-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-[#E87C41]/30 focus:border-[#E87C41]/50 focus:outline-none transition-all font-medium bg-white/5 border-white/10 text-white placeholder-white/20"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-4 rounded-[14px] font-bold text-[16px] text-[#E87C41] border-2 border-[#E87C41] bg-transparent cursor-pointer flex items-center justify-center gap-2 group/btn btn-sweep-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 relative z-10">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Task...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative z-10">
                        <PlusCircle className="h-5 w-5" />
                        Publish Task
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-[28px] w-full max-w-md p-8 shadow-[0_20px_60px_rgba(239,68,68,0.15)] relative animate-scale-in flex flex-col glass-panel border border-red-500/20 bg-[#0a0a0a]">
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 shadow-inner">
                <CheckCircle2 className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Delete Task
                </h2>
              </div>
            </div>
            
            <p className="text-white/60 mb-8 mt-2">
              Are you sure you want to completely delete this task? This action cannot be undone.
            </p>
            
            <div className="flex items-center space-x-3 w-full">
              <button 
                onClick={() => { setShowDeleteModal(false); setDeletingTaskId(null); }}
                className="flex-1 py-3 rounded-[14px] font-bold text-[15px] text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-[14px] font-bold text-[15px] text-white bg-red-500 hover:bg-red-600 border border-red-500/50 shadow-lg hover:shadow-red-500/20 transition-all hover:-translate-y-0.5"
              >
                Yes, Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
