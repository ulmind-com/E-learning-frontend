import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  BookOpen,
  Video,
  Sparkles,
  Users,
  Loader2,
  X,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Clock,
  PlayCircle,
  User
} from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const AdminCourseAnalytics = () => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const courseFromState = location.state?.course;
  
  const [course, setCourse] = useState(courseFromState || null);
  const [loading, setLoading] = useState(!courseFromState);
  const [error, setError] = useState('');
  
  const [aiReport, setAiReport] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedAIStudent, setSelectedAIStudent] = useState(null);

  useEffect(() => {
    if (!courseFromState) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/courses/admin/overview/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const foundCourse = data.find(c => c._id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIReport = async (studentId, courseIdParam, studentName) => {
    setSelectedAIStudent(studentName);
    setShowAIModal(true);
    setAiLoading(true);
    setAiReport(null);
    try {
      const { data } = await axios.get(`${API_URL}/courses/admin/${courseIdParam}/students/${studentId}/performance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiReport(data.report);
    } catch (err) {
      setAiReport({ error: "Failed to fetch AI analysis. Check backend logs or OpenRouter API key." });
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="p-8 rounded-2xl border flex flex-col items-center max-w-md text-center shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--danger)' }}>
          <AlertCircle className="h-16 w-16 mb-4 opacity-80" style={{ color: 'var(--danger)' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Error loading course</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error || 'The requested course could not be found.'}</p>
          <button onClick={() => navigate('/admin')} className="px-6 py-2.5 border rounded-lg font-semibold shadow-sm hover:shadow-md transition-all" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const allStudents = [...(course.activeStudents || []), ...(course.inactiveStudents || [])];

  return (
    <div className="flex-1 p-6 md:p-10 animate-fade-in max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center space-x-2 text-sm font-medium hover:-translate-x-1.5 transition-transform duration-300 group"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Back to Executive Dashboard</span>
        </button>
      </div>

      <div className="space-y-8 animate-slide-up">
        {/* Formal Executive Course Header */}
        <div className="relative overflow-hidden rounded-[1.5rem] border shadow-sm group transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="absolute left-0 top-0 w-1.5 h-full bg-blue-500"></div>
          
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:justify-between md:items-center gap-8 z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {course.thumbnail ? (
                <div className="relative h-28 w-40 rounded-xl overflow-hidden shadow-md shrink-0 border group-hover:shadow-lg transition-shadow duration-500" style={{ borderColor: 'var(--border-color)' }}>
                  <img src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : (
                <div className="h-28 w-40 rounded-xl flex items-center justify-center border shadow-md shrink-0 group-hover:shadow-lg transition-shadow duration-500" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                  <BookOpen className="h-10 w-10 opacity-50" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                    {course.category || 'General'}
                  </span>
                </div>
                <h1 className="font-bold text-3xl tracking-tight mb-4 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>{course.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2 rounded-lg text-xs font-semibold border flex items-center shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    Active: <span className="ml-1.5 font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{course.activeCount}</span>
                  </div>
                  <div className="px-4 py-2 rounded-lg text-xs font-semibold border flex items-center shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-2.5 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                    Inactive: <span className="ml-1.5 font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{course.inactiveCount}</span>
                  </div>
                  <div className="px-4 py-2 rounded-lg text-xs font-semibold border flex items-center shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <Video className="h-4 w-4 mr-2.5 text-blue-500" />
                    Modules: <span className="ml-1.5 font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{course.totalVideos}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block shrink-0 p-6 rounded-xl border shadow-sm" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div className="flex flex-col items-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-2xl font-light" style={{ color: 'var(--text-primary)' }}>{allStudents.length}</span>
                <span className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>Total Enrolled</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formal Students Data Table */}
        <div className="rounded-[1.5rem] border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="p-6 md:p-8 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Student Performance Metrics</h2>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Detailed engagement data and AI insights for all enrolled students.</p>
            </div>
            <div className="p-2 rounded-lg border shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {allStudents.length === 0 ? (
              <div className="text-center py-20">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No Enrollment Data</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Students will appear here once they enroll in this course.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
                    <th className="py-5 px-6 font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Student Profile</th>
                    <th className="py-5 px-4 font-semibold text-xs text-center uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Status</th>
                    <th className="py-5 px-4 font-semibold text-xs text-center uppercase tracking-widest w-48" style={{ color: 'var(--text-muted)' }}>Completion</th>
                    <th className="py-5 px-4 font-semibold text-xs text-center uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Score</th>
                    <th className="py-5 px-4 font-semibold text-xs text-center uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Pace</th>
                    <th className="py-5 px-4 font-semibold text-xs text-center uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Skips</th>
                    <th className="py-5 px-6 font-semibold text-xs text-right uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {allStudents.map((student, idx) => {
                    const isActive = (course.activeStudents || []).some(s => s._id === student._id);
                    const progressPct = course.totalVideos > 0 ? Math.min(100, Math.round(((student.completedVideosCount || 0) / course.totalVideos) * 100)) : 0;
                    return (
                      <tr key={student._id} className="border-b last:border-0 transition-colors duration-300 animate-fade-in-up hover:bg-[var(--bg-input)]" style={{ borderColor: 'var(--border-color)', animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-11 w-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner bg-gradient-to-br from-indigo-500 to-purple-600">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{student.name}</div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isActive ? (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-widest shadow-sm">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-widest shadow-sm">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-full rounded-full h-2 overflow-hidden shadow-inner" style={{ backgroundColor: 'var(--bg-input)' }}>
                              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? '#10b981' : '#3b82f6' }}></div>
                            </div>
                            <span className="text-xs font-bold w-9 text-right" style={{ color: 'var(--text-secondary)' }}>{progressPct}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center justify-center h-8 px-3.5 rounded-lg font-bold text-xs shadow-sm border transition-colors duration-300" style={{ 
                            backgroundColor: student.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.1)' : student.performanceScore >= 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: student.performanceScore >= 80 ? '#10b981' : student.performanceScore >= 50 ? '#f59e0b' : '#ef4444',
                            borderColor: student.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : student.performanceScore >= 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                          }}>
                            {student.performanceScore} <span className="opacity-50 ml-1 font-medium">/ 100</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5" style={{ color: 'var(--text-secondary)' }}>
                            <PlayCircle className="h-3.5 w-3.5 opacity-50" />
                            <span className="text-sm font-semibold">{student.avgSpeed || 1}x</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5" style={{ color: 'var(--text-secondary)' }}>
                            <Clock className="h-3.5 w-3.5 opacity-50" />
                            <span className="text-sm font-semibold">{student.totalSkips || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => fetchAIReport(student._id, course._id, student.name)}
                            className="relative inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm focus:outline-none group overflow-hidden bg-emerald-500 text-white border border-emerald-600"
                          >
                            <div className="absolute inset-0 w-0 bg-gray-900 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                            <Sparkles className="h-3.5 w-3.5 relative z-10 text-white" />
                            <span className="relative z-10 text-white">AI Insight</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Formal AI Analysis Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-[1.5rem] max-w-2xl w-full p-8 shadow-2xl relative border animate-scale-in max-h-[90vh] flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button 
              onClick={() => setShowAIModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full transition-colors opacity-70 hover:opacity-100" style={{ backgroundColor: 'var(--bg-input)' }}
            >
              <X className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
            </button>
            
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <Sparkles className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Executive AI Insight</h3>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Comprehensive analysis for <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedAIStudent}</span></p>
              </div>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-[200px]">
              {aiLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 animate-pulse"></div>
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 relative z-10" />
                  </div>
                  <p className="text-sm font-semibold tracking-wide animate-pulse uppercase" style={{ color: 'var(--text-muted)' }}>Synthesizing Performance Data...</p>
                </div>
              ) : aiReport ? (
                aiReport.error ? (
                  <div className="p-5 rounded-xl border flex items-start space-x-3 shadow-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium">{aiReport.error}</p>
                  </div>
                ) : (
                  <div className="prose prose-sm md:prose-base max-w-none p-6 md:p-8 rounded-xl border leading-relaxed shadow-inner" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <style>{`
                      .prose h1, .prose h2, .prose h3, .prose h4, .prose strong { color: var(--text-primary); }
                      .prose p { color: var(--text-secondary); }
                    `}</style>
                    <div dangerouslySetInnerHTML={{ __html: typeof aiReport === 'string' ? aiReport.replace(/\n/g, '<br/>') : String(aiReport).replace(/\n/g, '<br/>') }} />
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12" style={{ color: 'var(--text-muted)' }}>
                  <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">Report unavailable.</p>
                </div>
              )}
            </div>
            
            {!aiLoading && aiReport && !aiReport.error && (
              <div className="mt-8 pt-6 border-t flex justify-end shrink-0" style={{ borderColor: 'var(--border-color)' }}>
                <button 
                  onClick={() => setShowAIModal(false)}
                  className="px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-md border"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                >
                  Acknowledge Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseAnalytics;
