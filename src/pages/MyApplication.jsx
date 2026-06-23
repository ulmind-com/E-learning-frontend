import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Certificate from '../components/Certificate';
import { CheckCircle, Clock, FileText, Send, Award, ArrowRight, ExternalLink, XCircle, Loader2, Code2 } from 'lucide-react';

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
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[var(--accent)] mb-4" />
      <p className="text-[var(--text-secondary)] font-medium animate-pulse">Loading your application details...</p>
    </div>
  );

  if (!application) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-fade-in">
        <div className="max-w-md w-full text-center space-y-8 bg-[var(--bg-secondary)] p-10 rounded-[2rem] shadow-2xl border border-[var(--border-color)]">
          <div className="w-20 h-20 bg-[var(--accent-glow)] rounded-full flex items-center justify-center mx-auto mb-6">
             <FileText className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Not Applied Yet</h2>
          <p className="text-[var(--text-secondary)] font-medium">You haven't submitted an internship application. Start your journey today!</p>
          <Link to="/apply-internship" className="group relative inline-flex justify-center items-center py-3.5 px-8 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--accent)] hover:bg-indigo-600 transition-all duration-500 hover:shadow-[0_8px_25px_var(--accent-glow-strong)] hover:-translate-y-1 active:scale-95 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Apply Now <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-5 h-5" />;
      case 'Completed': return <Award className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-2">My Application</h1>
          <p className="text-[var(--text-secondary)] font-medium text-lg">Track your internship progress and manage tasks.</p>
        </div>
      </div>

      {/* Premium Status Card */}
      <div className="relative bg-[var(--bg-card)] rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[var(--border-color)] overflow-hidden mb-12 group transition-all duration-500 hover:shadow-[0_15px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent opacity-50"></div>
        <div className="relative z-10 px-8 py-6 border-b border-[var(--border-color)] flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-glow)] flex items-center justify-center shadow-inner">
               <FileText className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Current Status</h3>
              <p className="text-sm text-[var(--text-muted)] font-medium">Application ID: <span className="uppercase tracking-wider">{application._id.substring(0,8)}</span></p>
            </div>
          </div>
          <div className={`px-5 py-2.5 inline-flex items-center gap-2 text-sm font-bold rounded-full border ${getStatusColor(application.status)} transition-transform duration-300 hover:scale-105 shadow-sm`}>
            {getStatusIcon(application.status)}
            {application.status}
          </div>
        </div>
        <div className="relative z-10 p-8">
          <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
            {application.status === 'Pending' && "Your application is currently under review. We'll notify you via email once it is approved!"}
            {application.status === 'Approved' && "Congratulations! Your application is approved. Please proceed to complete your assigned tasks below."}
            {application.status === 'Completed' && "Excellent work! You have successfully completed your internship. Your certificate is ready."}
            {application.status === 'Rejected' && "Unfortunately, your application was not accepted at this time. Thank you for your interest."}
          </p>
        </div>
      </div>

      {/* Tasks Section */}
      {application.status !== 'Pending' && application.status !== 'Rejected' && (
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shadow-sm">
               <Code2 className="w-6 h-6 text-indigo-500" />
             </div>
             <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Assigned Tasks</h2>
          </div>

          {application.assignedTasks.length === 0 ? (
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 text-center border border-[var(--border-color)]">
               <p className="text-[var(--text-secondary)] font-bold text-xl">No tasks have been assigned yet.</p>
               <p className="text-[var(--text-muted)] mt-2">Check back later when your mentor assigns a new project.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {application.assignedTasks.map((t, index) => (
                <div key={t._id} className="relative bg-[var(--bg-card)] rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[var(--border-color)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 group flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Task Header */}
                  <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 transition-colors duration-300 group-hover:bg-[var(--bg-secondary)]">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300">{t.task?.title}</h4>
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-bold border whitespace-nowrap shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                        t.status === 'Verified' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                        t.status === 'Submitted' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {/* Task Body */}
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed flex-grow">{t.task?.details}</p>
                    
                    {t.task?.referalLink && (
                      <a href={t.task.referalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[var(--accent)] text-sm font-bold hover:underline mb-6 transition-transform hover:translate-x-1 w-fit">
                        View Resources <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {t.status === 'Pending' && submittingTask !== t.task?._id && (
                      <button 
                        onClick={() => setSubmittingTask(t.task?._id)}
                        className="w-full mt-auto flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 rounded-xl hover:bg-[var(--accent)] hover:text-white hover:border-transparent transition-all duration-300 font-bold active:scale-95 shadow-sm"
                      >
                        Submit Task <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    )}

                    {submittingTask === t.task?._id && (
                      <form onSubmit={(e) => submitTask(t.task?._id, e)} className="mt-auto space-y-4 animate-fade-in bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-inner">
                        <input required name="gitRepo" placeholder="GitHub Repository URL" value={submissionForm.gitRepo} onChange={handleSubmissionChange} className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                        <input required name="liveLink" placeholder="Live Demo URL" value={submissionForm.liveLink} onChange={handleSubmissionChange} className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                        <input required name="documentUrl" placeholder="Document/Report URL" value={submissionForm.documentUrl} onChange={handleSubmissionChange} className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition-all" />
                        <div className="flex gap-3 pt-2">
                          <button type="submit" className="flex-1 bg-[var(--accent)] text-white font-bold px-4 py-3 rounded-xl text-sm hover:bg-indigo-600 transition-all hover:shadow-[0_4px_15px_var(--accent-glow-strong)] active:scale-95">Submit</button>
                          <button type="button" onClick={() => setSubmittingTask(null)} className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold px-4 py-3 rounded-xl text-sm hover:bg-[var(--bg-input)] transition-all active:scale-95">Cancel</button>
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

      {application.certificateIssued && (
        <div className="mt-20 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-[3rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] p-10 md:p-16 text-center animate-slide-up overflow-hidden group border border-white/10">
          {/* Decorative glare */}
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl mb-8 animate-bounce-subtle border border-white/20 shadow-2xl">
              <Award className="w-12 h-12 text-white drop-shadow-md" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-5 drop-shadow-lg">Congratulations! 🎉</h2>
            <p className="text-indigo-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              You have successfully completed all tasks and projects. Your internship is officially verified and your certificate is ready.
            </p>
            <div className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-4 border-white/10 bg-white">
              <Certificate userName={application.resume.name} issueDate={new Date().toLocaleDateString()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplication;

