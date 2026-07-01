import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, User, GraduationCap, Phone, Mail, 
  CheckCircle, Clock, Search, ExternalLink, 
  Code, X, Award, FileText, CheckSquare, Loader2, Sparkles, Send, GitBranch, File
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-1-r539.onrender.com/api';

const AdminInternships = () => {
  const [applications, setApplications] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedApp, setSelectedApp] = useState(null);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [appRes, taskRes] = await Promise.all([
        axios.get(`${API_URL}/internship/applications`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/internship/tasks`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setApplications(appRes.data);
      setAllTasks(taskRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (app) => {
    setSelectedApp(app);
    setSelectedTaskIds([]);
    setShowTasksModal(true);
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const assignTasks = async () => {
    if (selectedTaskIds.length === 0) return alert('Select at least one task');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/internship/applications/${selectedApp._id}/verify`, { taskIds: selectedTaskIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowTasksModal(false);
      fetchData();
    } catch (err) {
      alert('Error assigning tasks');
    }
  };

  const verifyTask = async (appId, taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/internship/applications/${appId}/verify-task`, { taskId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Error verifying task');
    }
  };

  const issueCertificate = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/internship/applications/${appId}/issue-certificate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error issuing certificate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative font-sans">
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/5 animate-pulse"></div>
              <div className="space-y-3">
                <div className="w-32 h-3 bg-white/5 rounded-full animate-pulse"></div>
                <div className="w-64 h-8 bg-white/10 rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="w-32 h-12 rounded-xl bg-[#111] border border-white/5 animate-pulse"></div>
          </div>
          
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl p-8" style={{ animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.1}s` }}>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#E87C41]/20"></div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-white/5"></div>
                    <div className="space-y-3">
                      <div className="w-48 h-5 bg-white/10 rounded-lg"></div>
                      <div className="w-32 h-4 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="w-24 h-8 rounded-full bg-[#E87C41]/10"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="w-full h-12 bg-[#111] rounded-xl border border-white/5"></div>
                   <div className="w-full h-12 bg-[#111] rounded-xl border border-white/5"></div>
                </div>
                <div className="mt-8 flex justify-end">
                   <div className="w-40 h-12 rounded-xl bg-white/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans">
      {/* Sleek Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#E87C41]/5 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#E87C41]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Briefcase className="w-8 h-8 text-[#E87C41] relative z-10" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Admin Dashboard</h3>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Manage Internships</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/5 px-6 py-3 rounded-xl shadow-lg">
             <div className="w-2 h-2 rounded-full bg-[#E87C41] animate-pulse"></div>
             <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total Apps: <span className="text-white ml-2">{applications.length}</span></span>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-8">
          {applications.map((app, index) => {
            let statusColor = '#E87C41'; // default Pending/Orange
            if(app.status === 'Approved') statusColor = '#E87C41'; 
            if(app.status === 'Completed') statusColor = '#10b981'; // emerald for complete
            
            return (
              <div 
                key={app._id} 
                className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all duration-300 relative shadow-2xl"
                style={{ animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both` }}
              >
                {/* Dynamic Status Border Line */}
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#E87C41', boxShadow: `0 0 20px #E87C4140` }}></div>

                {/* Card Header */}
                <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#050505]">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-xl font-black uppercase text-white shadow-inner">
                      {app.resume.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight mb-2">{app.resume.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E87C41]/10 text-[#E87C41] border border-[#E87C41]/20">
                          <Briefcase className="w-3.5 h-3.5" /> 
                          {app.internship?.title || 'General Internship'}
                        </span>
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {app.resume.email}</span>
                        <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {app.resume.college}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded border" style={{ backgroundColor: `${statusColor}10`, color: statusColor, borderColor: `${statusColor}30` }}>
                      {app.status}
                    </span>

                    {/* Actions */}
                    {app.status === 'Pending' && (
                      <button 
                        onClick={() => openAssignModal(app)} 
                        className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-white hover:bg-[#E87C41] hover:text-black hover:border-transparent transition-all duration-300"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Approve & Assign
                      </button>
                    )}
                    {app.status === 'Approved' && app.assignedTasks.every(t => t.status === 'Verified') && !app.certificateIssued && (
                      <button 
                        onClick={() => issueCertificate(app._id)} 
                        className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E87C41] border border-transparent text-black hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(232,124,65,0.4)]"
                      >
                        <Award className="w-4 h-4" />
                        Issue Certificate
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-8 grid lg:grid-cols-2 gap-8">
                  {/* Left Column: Profile */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Candidate Profile
                    </h4>
                    
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-2">Phone</p>
                          <p className="text-sm font-medium text-gray-300">{app.resume.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-2">Education</p>
                          <p className="text-sm font-medium text-gray-300">{app.resume.degree}</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-white/5">
                         <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-2">Technical Skills</p>
                         <p className="text-sm font-medium text-gray-300 leading-relaxed">{app.resume.skills}</p>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
                        {app.resume.linkedin && (
                          <a href={app.resume.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors">
                            LinkedIn <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.resume.github && (
                          <a href={app.resume.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors">
                            GitHub <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.resume.portfolio && (
                          <a href={app.resume.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E87C41]/10 border border-[#E87C41]/20 text-[10px] font-black uppercase tracking-[0.1em] text-[#E87C41] hover:bg-[#E87C41]/20 transition-colors">
                            Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Tasks Pipeline */}
                  {app.assignedTasks.length > 0 ? (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E87C41] mb-6 flex items-center gap-2">
                        <Code className="w-3.5 h-3.5" /> Assignment Pipeline
                      </h4>
                      
                      <div className="space-y-4">
                        {app.assignedTasks.map((t, idx) => {
                          const isVerified = t.status === 'Verified';
                          const isSubmitted = t.status === 'Submitted';
                          const tColor = isVerified ? '#10b981' : (isSubmitted ? '#3b82f6' : '#E87C41');
                          
                          return (
                            <div key={t._id} className="bg-[#111] border border-white/5 rounded-2xl p-5 relative overflow-hidden group/task">
                              <div className="absolute top-0 left-0 w-0.5 h-full" style={{ backgroundColor: '#E87C41' }}></div>
                              
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-3 items-center">
                                  <span className="w-6 h-6 rounded bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <span className="font-black text-sm text-gray-200">{t.task?.title}</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded border" style={{ backgroundColor: `${tColor}10`, color: tColor, borderColor: `${tColor}30` }}>
                                  {t.status}
                                </span>
                              </div>
                              
                              {t.status === 'Submitted' && (
                                <div className="mt-5 pt-5 border-t border-white/5">
                                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#3b82f6] mb-4 flex items-center gap-1.5">
                                    <Send className="w-3 h-3" /> Candidate Submission
                                  </p>
                                  <div className="flex flex-col gap-2 mb-5">
                                    <a href={t.submission.gitRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-[#050505] p-3 rounded-lg border border-white/5">
                                      <GitBranch className="w-4 h-4" /> Repository Link
                                    </a>
                                    <a href={t.submission.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-[#050505] p-3 rounded-lg border border-white/5">
                                      <ExternalLink className="w-4 h-4" /> Live Deployment
                                    </a>
                                    <a href={t.submission.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-[#050505] p-3 rounded-lg border border-white/5">
                                      <File className="w-4 h-4" /> Project Docs
                                    </a>
                                  </div>
                                  <button 
                                    onClick={() => verifyTask(app._id, t.task._id)} 
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#10b981] hover:brightness-110 text-black rounded-lg transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Verify & Accept
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                        <Code className="w-3.5 h-3.5" /> Assignment Pipeline
                      </h4>
                      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[calc(100%-2.5rem)] min-h-[200px]">
                        <CheckSquare className="w-8 h-8 text-gray-600 mb-3" />
                        <p className="text-sm font-medium text-gray-400">No tasks assigned yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {applications.length === 0 && (
            <div className="text-center py-32 px-6 rounded-3xl border border-white/5 bg-[#0a0a0a] relative overflow-hidden">
               <div className="flex flex-col items-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                  <Briefcase className="h-8 w-8 text-[#E87C41] opacity-50" />
                </div>
                <h3 className="text-xl font-black mb-2 text-white tracking-tight">No Applications Yet</h3>
                <p className="text-gray-500 text-sm font-medium">The pipeline is empty. New applications will appear here.</p>
              </div>
            </div>
          )}
        </div>

        {/* Assign Task Modal */}
        {showTasksModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#E87C41]"></div>
              
              <div className="flex justify-between items-start mb-8 shrink-0 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-2">Assign Tasks</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E87C41] flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Candidate: {selectedApp?.resume.name}
                  </p>
                </div>
                <button onClick={() => setShowTasksModal(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-8 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {allTasks.map(task => {
                  const isSelected = selectedTaskIds.includes(task._id);
                  return (
                    <label 
                      key={task._id} 
                      className={`flex items-start gap-4 p-5 border rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#E87C41] bg-[#E87C41]/5' 
                          : 'border-white/5 bg-[#111] hover:border-white/20'
                      }`}
                    >
                      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleTaskSelection(task._id)} 
                          className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded checked:bg-[#E87C41] checked:border-[#E87C41] transition-all cursor-pointer bg-black"
                        />
                        <CheckCircle className="absolute h-3 w-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100" />
                      </div>
                      <div>
                        <p className={`font-black text-sm mb-1 ${isSelected ? 'text-[#E87C41]' : 'text-gray-200'}`}>{task.title}</p>
                        <p className="text-xs font-medium text-gray-500 leading-relaxed">{task.details}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-white/5 shrink-0">
                <button 
                  onClick={() => setShowTasksModal(false)} 
                  className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors border border-white/10 bg-[#111] hover:bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={assignTasks} 
                  className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 bg-[#E87C41] text-black shadow-[0_0_20px_rgba(232,124,65,0.3)]"
                >
                  <CheckSquare className="w-4 h-4" />
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E87C41;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default AdminInternships;
