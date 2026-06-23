import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, PlusCircle, ExternalLink, Link as LinkIcon, FileText, CheckCircle2, Loader2, ListTodo } from 'lucide-react';

const API_URL = 'https://e-learning-backend-tubf.onrender.com/api';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', details: '', referalLink: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 20px var(--accent-glow-strong)' }}>
            <ListTodo className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Manage Tasks</h1>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Create and organize internship assignments</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 rounded-full font-bold text-sm inline-flex items-center space-x-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
          <ClipboardList className="h-4 w-4" />
          <span>{tasks.length} Active Tasks</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Created Tasks Grid (2 per row) */}
        <div className="lg:w-2/3 order-2 lg:order-1 space-y-6">
          <h2 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
            <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <span>Available Task Templates</span>
          </h2>
          
          {tasks.length === 0 ? (
            <div className="p-10 rounded-3xl border border-dashed text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No Tasks Created</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Use the form on the right to create your first internship task.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task, index) => (
                <div 
                  key={task._id} 
                  className="rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col group relative overflow-hidden" 
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {/* Subtle top highlight */}
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: 'var(--accent)', opacity: 0.8 }}></div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold mb-3 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{task.title}</h3>
                    <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'var(--text-muted)' }}>{task.details}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Task #{index + 1}</span>
                    {task.referalLink ? (
                      <a 
                        href={task.referalLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border group-hover:-translate-y-0.5"
                        style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-glow)', borderColor: 'transparent' }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Reference</span>
                      </a>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-500/10 text-gray-500">No Link</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Create Task Form (Sticky) */}
        <div className="lg:w-1/3 order-1 lg:order-2">
          <div className="sticky top-24 rounded-3xl p-6 shadow-xl border overflow-hidden relative" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--accent)' }}></div>
            
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-glow)' }}>
                <PlusCircle className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Create New Task</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <FileText className="h-4 w-4" />
                  <span>Task Title</span>
                </label>
                <input 
                  required 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="e.g. Build a landing page"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all font-medium"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <ClipboardList className="h-4 w-4" />
                  <span>Task Details</span>
                </label>
                <textarea 
                  required 
                  name="details" 
                  rows="5" 
                  value={formData.details} 
                  onChange={handleChange} 
                  placeholder="Describe the requirements..."
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all font-medium resize-none"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                ></textarea>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <LinkIcon className="h-4 w-4" />
                  <span>Reference Link (Optional)</span>
                </label>
                <input 
                  name="referalLink" 
                  type="url" 
                  value={formData.referalLink} 
                  onChange={handleChange} 
                  placeholder="https://..."
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all font-medium"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center space-x-2 transition-all hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ backgroundColor: 'var(--accent)', boxShadow: loading ? 'none' : '0 4px 15px var(--accent-glow-strong)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    <span>Publish Task</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;

