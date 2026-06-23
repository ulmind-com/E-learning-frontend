import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, User, GraduationCap, Phone, Mail, 
  CheckCircle, Clock, Search, ExternalLink, 
  Code, X, Award, FileText, CheckSquare, Loader2
} from 'lucide-react';

const API_URL = 'https://e-learning-backend-tubf.onrender.com/api';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 20px var(--accent-glow-strong)' }}>
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Manage Internships</h1>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Review applications and assign tasks</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-full font-bold text-sm" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
          {applications.length} Total Applications
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-8">
        {applications.map(app => (
          <div key={app._id} className="rounded-3xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl group" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            {/* Card Header */}
            <div className="px-6 py-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold uppercase" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                  {app.resume.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{app.resume.name}</h3>
                  <div className="flex items-center space-x-3 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center space-x-1"><Mail className="h-3.5 w-3.5" /> <span>{app.resume.email}</span></span>
                    <span>•</span>
                    <span className="flex items-center space-x-1"><GraduationCap className="h-3.5 w-3.5" /> <span>{app.resume.college}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Status Badge */}
                <span className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                  app.status === 'Completed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                  {app.status === 'Pending' && <Clock className="h-4 w-4" />}
                  {app.status === 'Approved' && <CheckCircle className="h-4 w-4" />}
                  {app.status === 'Completed' && <Award className="h-4 w-4" />}
                  <span>{app.status}</span>
                </span>

                {/* Actions */}
                {app.status === 'Pending' && (
                  <button 
                    onClick={() => openAssignModal(app)} 
                    className="flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold text-white transition-transform hover:-translate-y-0.5 shadow-md"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 15px var(--accent-glow)' }}
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span>Approve & Assign</span>
                  </button>
                )}
                {app.status === 'Approved' && app.assignedTasks.every(t => t.status === 'Verified') && !app.certificateIssued && (
                  <button 
                    onClick={() => issueCertificate(app._id)} 
                    className="flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-500/20"
                  >
                    <Award className="h-4 w-4" />
                    <span>Issue Certificate</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Left Column: Resume Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                  <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Application Details</h4>
                </div>
                
                <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold mb-1 flex items-center space-x-1" style={{ color: 'var(--text-muted)' }}>
                        <Phone className="h-3.5 w-3.5" /> <span>Phone</span>
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{app.resume.phone}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold mb-1 flex items-center space-x-1" style={{ color: 'var(--text-muted)' }}>
                        <GraduationCap className="h-3.5 w-3.5" /> <span>Degree</span>
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{app.resume.degree}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold mb-1 flex items-center space-x-1" style={{ color: 'var(--text-muted)' }}>
                        <Briefcase className="h-3.5 w-3.5" /> <span>Skills</span>
                      </span>
                      <span className="font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{app.resume.skills}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 pt-4 border-t flex flex-wrap gap-3" style={{ borderColor: 'var(--border-color)' }}>
                    {app.resume.linkedin && (
                      <a href={app.resume.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0a66c2]/10 text-[#0a66c2] hover:bg-[#0a66c2]/20 transition-colors border border-[#0a66c2]/20">
                        <User className="h-3.5 w-3.5" /> <span>LinkedIn</span>
                      </a>
                    )}
                    {app.resume.github && (
                      <a href={app.resume.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors border border-gray-500/20">
                        <Code className="h-3.5 w-3.5" /> <span>GitHub</span>
                      </a>
                    )}
                    {app.resume.portfolio && (
                      <a href={app.resume.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                        <ExternalLink className="h-3.5 w-3.5" /> <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Tasks Progress */}
              {app.assignedTasks.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckSquare className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                    <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Assigned Tasks</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {app.assignedTasks.map(t => (
                      <div key={t._id} className="p-4 rounded-2xl border transition-colors hover:border-[var(--border-hover)]" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold pr-4" style={{ color: 'var(--text-primary)' }}>{t.task?.title}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 border ${
                            t.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            t.status === 'Submitted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        
                        {t.status === 'Submitted' && (
                          <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                            <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Student Submission</p>
                            <div className="flex flex-col space-y-2 mb-4">
                              <a href={t.submission.gitRepo} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                                <Code className="h-4 w-4" /> <span>GitHub Repo</span>
                              </a>
                              <a href={t.submission.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                                <ExternalLink className="h-4 w-4" /> <span>Live Demo</span>
                              </a>
                              <a href={t.submission.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                                <FileText className="h-4 w-4" /> <span>Documentation</span>
                              </a>
                            </div>
                            <button 
                              onClick={() => verifyTask(app._id, t.task._id)} 
                              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl transition-colors font-bold text-sm"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Verify & Accept</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="text-center py-20 px-6 rounded-3xl border border-dashed" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-input)] mb-4">
              <Briefcase className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Applications Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>There are currently no internship applications to review.</p>
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      {showTasksModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border" style={{ borderColor: 'var(--border-color)' }}>
            
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Assign Tasks</h2>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>For {selectedApp?.resume.name}</p>
              </div>
              <button onClick={() => setShowTasksModal(false)} className="p-2 rounded-full hover:bg-[var(--bg-input)] transition-colors text-[var(--text-muted)]">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6 overflow-y-auto pr-2 custom-scrollbar">
              {allTasks.map(task => {
                const isSelected = selectedTaskIds.includes(task._id);
                return (
                  <label 
                    key={task._id} 
                    className={`flex items-start space-x-4 p-5 border rounded-2xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[var(--accent)] bg-[var(--accent-glow)] shadow-md' 
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="relative flex items-center justify-center mt-1 shrink-0">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => handleTaskSelection(task._id)} 
                        className="peer appearance-none w-5 h-5 border-2 rounded shadow-sm checked:bg-[var(--accent)] checked:border-[var(--accent)] transition-all cursor-pointer"
                        style={{ borderColor: 'var(--border-color)' }}
                      />
                      <CheckCircle className="absolute h-3.5 w-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <p className={`font-bold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{task.title}</p>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{task.details}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            
            <div className="flex space-x-4 pt-4 border-t shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <button 
                onClick={() => setShowTasksModal(false)} 
                className="flex-1 py-3 rounded-xl font-bold transition-colors border hover:bg-[var(--bg-input)]"
                style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
              >
                Cancel
              </button>
              <button 
                onClick={assignTasks} 
                className="flex-1 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 15px var(--accent-glow-strong)' }}
              >
                <CheckSquare className="h-5 w-5" />
                <span>Confirm Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInternships;

