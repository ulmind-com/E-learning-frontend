import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Certificate from '../components/Certificate';
import { CheckCircle, Clock, FileText, Send, Award, ArrowRight, ExternalLink, XCircle, Loader2, Code2, Sparkles, AlertCircle } from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const MyApplication = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Task submission state
  const [submittingTask, setSubmittingTask] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ gitRepo: '', liveLink: '', documentUrl: '' });

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/internship/my-application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplication(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionChange = (e) => {
    setSubmissionForm({ ...submissionForm, [e.target.name]: e.target.value });
  };

  const submitTask = async (taskId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/internship/submit-task`, { taskId, ...submissionForm }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmittingTask(null);
      setSubmissionForm({ gitRepo: '', liveLink: '', documentUrl: '' });
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting task');
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="w-20 h-20 bg-[var(--accent-glow)] rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)]" />
      </div>
      <p className="text-[var(--text-secondary)] text-lg font-medium animate-pulse">Loading your application details...</p>
    </div>
  );

  if (!application) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-scale-in">
        <div className="max-w-lg w-full text-center space-y-8 bg-[var(--bg-secondary)] p-12 rounded-[2.5rem] shadow-2xl border border-[var(--border-color)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
          
          <div className="w-24 h-24 bg-[var(--accent-glow)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-float">
             <FileText className="w-12 h-12 text-[var(--accent)]" />
          </div>
          <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Not Applied Yet</h2>
          <p className="text-[var(--text-secondary)] text-lg font-medium">You haven't submitted an internship application. Start your journey today and gain real-world experience!</p>
          <Link to="/apply-internship" className="group relative inline-flex justify-center items-center py-4 px-10 border border-transparent text-lg font-bold rounded-2xl text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all duration-500 hover:shadow-[0_8px_30px_var(--accent-glow-strong)] hover:-translate-y-1 active:scale-95 overflow-hidden w-full sm:w-auto">
            <span className="relative z-10 flex items-center gap-3">
              Apply Now <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Approved': return { color: 'bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/10', icon: <CheckCircle className="w-6 h-6" /> };
      case 'Completed': return { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10', icon: <Award className="w-6 h-6" /> };
      case 'Rejected': return { color: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10', icon: <XCircle className="w-6 h-6" /> };
      default: return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-yellow-500/10', icon: <Clock className="w-6 h-6 animate-pulse" /> };
    }
  };

  const statusConfig = getStatusConfig(application.status);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-slide-down">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3 flex items-center gap-3">
            My Application <Sparkles className="w-8 h-8 text-[var(--accent)] animate-pulse-glow rounded-full" />
          </h1>
          <p className="text-[var(--text-secondary)] font-medium text-lg">Track your internship progress and manage your assigned tasks.</p>
        </div>
      </div>

      {/* Premium Status Card */}
      <div className="relative bg-[var(--bg-card)] rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[var(--border-color)] overflow-hidden mb-16 group premium-card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 px-8 py-8 border-b border-[var(--border-color)] flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${statusConfig.color.split(' ')[0]}`}>
               {React.cloneElement(statusConfig.icon, { className: 'w-8 h-8' })}
            </div>
            <div>
              <h3 className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Application Status</h3>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-black ${statusConfig.color.split(' ')[1]}`}>{application.status}</span>
                <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-xs font-mono text-[var(--text-secondary)] shadow-sm">ID: {application._id.substring(0,8)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 p-8 sm:p-10">
          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-4xl">
            {application.status === 'Pending' && "Your application is currently under review by our team. We appreciate your patience and will notify you via email once it is approved!"}
            {application.status === 'Approved' && "Congratulations! Your application is approved. Please proceed to complete your assigned tasks below to advance in your internship."}
            {application.status === 'Completed' && "Excellent work! You have successfully completed your internship. Your verified certificate is ready for download below."}
            {application.status === 'Rejected' && "Unfortunately, your application was not accepted at this time. Thank you for your interest and we encourage you to apply again in the future."}
          </p>
        </div>
      </div>

      {/* Tasks Section */}
      {application.status !== 'Pending' && application.status !== 'Rejected' && (
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-10 pl-2 border-l-4 border-[var(--accent)]">
             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shadow-sm">
               <Code2 className="w-6 h-6 text-indigo-500" />
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight">Assigned Tasks</h2>
          </div>

          {application.assignedTasks.length === 0 ? (
            <div className="bg-[var(--bg-card)] rounded-[2rem] p-16 text-center border border-[var(--border-color)] shadow-sm">
               <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-10 h-10 text-[var(--text-muted)]" />
               </div>
               <p className="text-[var(--text-primary)] font-bold text-2xl mb-2">No tasks assigned yet</p>
               <p className="text-[var(--text-secondary)] text-lg">Check back later when your mentor assigns a new project.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 stagger-children">
              {application.assignedTasks.map((t, index) => (
                <div key={t._id} className="flex flex-col bg-[var(--bg-card)] rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-color)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 group animate-scale-in">
                  
                  {/* Task Header */}
                  <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/30 group-hover:bg-[var(--bg-secondary)]/80 transition-colors duration-500">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-xl font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors duration-300">{t.task?.title}</h4>
                      <span className={`text-xs px-3 py-1.5 rounded-xl font-bold border whitespace-nowrap shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                        t.status === 'Verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        t.status === 'Submitted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {/* Task Body */}
                  <div className="p-8 flex-grow flex flex-col">
                    <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed flex-grow">{t.task?.details}</p>
                    
                    {t.task?.referalLink && (
                      <a href={t.task.referalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-500 font-bold hover:text-indigo-400 mb-8 transition-all hover:translate-x-1 w-fit bg-indigo-500/10 px-4 py-2 rounded-lg">
                        <ExternalLink className="w-4 h-4" /> View Resources
                      </a>
                    )}

                    {t.status === 'Pending' && submittingTask !== t.task?._id && (
                      <button 
                        onClick={() => setSubmittingTask(t.task?._id)}
                        className="w-full mt-auto flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] px-6 py-4 rounded-xl hover:bg-[var(--accent)] hover:text-white hover:border-transparent transition-all duration-300 font-bold active:scale-95 shadow-sm group/btn overflow-hidden relative"
                      >
                        <span className="relative z-10 flex items-center gap-2">Submit Task <Send className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" /></span>
                        <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      </button>
                    )}

                    {submittingTask === t.task?._id && (
                      <form onSubmit={(e) => submitTask(t.task?._id, e)} className="mt-auto space-y-4 animate-fade-in bg-[var(--bg-secondary)]/50 p-6 rounded-2xl border border-[var(--border-color)]">
                        <div className="space-y-3">
                          <input required name="gitRepo" placeholder="GitHub Repository URL" value={submissionForm.gitRepo} onChange={handleSubmissionChange} className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all" />
                          <input required name="liveLink" placeholder="Live Demo URL" value={submissionForm.liveLink} onChange={handleSubmissionChange} className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all" />
                          <input required name="documentUrl" placeholder="Document/Report URL" value={submissionForm.documentUrl} onChange={handleSubmissionChange} className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all" />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <button type="submit" className="flex-1 bg-[var(--accent)] text-white font-bold px-4 py-3 rounded-xl hover:bg-[var(--accent-hover)] transition-all hover:shadow-[0_4px_15px_var(--accent-glow-strong)] active:scale-95 flex justify-center items-center gap-2">
                            <Send className="w-4 h-4" /> Submit
                          </button>
                          <button type="button" onClick={() => setSubmittingTask(null)} className="flex-1 bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold px-4 py-3 rounded-xl hover:bg-[var(--border-color)] transition-all active:scale-95">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificate Section */}
      {application.certificateIssued && (
        <div className="mt-24 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[3rem] shadow-[0_20px_60px_rgba(79,70,229,0.2)] p-10 md:p-16 text-center animate-slide-up overflow-hidden group border border-white/10" style={{ animationDelay: '0.4s' }}>
          {/* Animated Glare */}
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-in-out pointer-events-none"></div>
          
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20 animate-float">
              <Award className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-lg">
              Congratulations! <span className="inline-block animate-bounce-subtle">🎉</span>
            </h2>
            
            <p className="text-indigo-100/90 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Your dedication and hard work have paid off. Your internship is officially verified and your certificate is ready to showcase your new skills!
            </p>
            
            {/* The Certificate Component - Now smaller and beautiful */}
            <div className="w-full flex justify-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Certificate userName={application.resume.name} issueDate={new Date().toLocaleDateString()} />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplication;

