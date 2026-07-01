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

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

const AdminCourseAnalytics = () => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const courseFromState = location.state?.course;
  
  const [course, setCourse] = useState(courseFromState || null);
  const [loading, setLoading] = useState(!courseFromState);
  const [error, setError] = useState('');

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
    <div className="min-h-screen relative text-white w-full" style={{ backgroundColor: '#050505' }}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTQuNjI3IDBiNS4zNzMgNS4zNzMtNS4zNzMgNS4zNzMuMTk3LjE5NyA1LjE3NiA1LjE3Ni01LjE3NiA1LjE3Ni0uMTk3LS4xOTd6IiBmaWxsPSIjRThDNzQxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-[0.03]"></div>
      
      <div className="relative z-10 flex-1 p-6 md:p-10 animate-fade-in max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-[#E87C41] hover:-translate-x-1.5 transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="uppercase tracking-widest">Back to Dashboard</span>
          </button>
        </div>

        <div className="space-y-8 animate-slide-up">
          {/* Elegant Dark Header */}
          <div className="bg-gradient-to-br from-[#1a1310] to-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E87C41]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {course.thumbnail ? (
                  <div className="h-28 w-44 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10 relative group-hover:border-[#E87C41]/30 transition-colors">
                    <img src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                  </div>
                ) : (
                  <div className="h-28 w-44 rounded-2xl flex items-center justify-center border border-white/10 bg-[#111] shrink-0">
                    <BookOpen className="h-10 w-10 text-white/20" />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-[#E87C41] text-black">
                      {course.category || 'General'}
                    </span>
                  </div>
                  <h1 className="font-bold text-3xl md:text-4xl tracking-tight mb-5 text-white group-hover:text-[#E87C41] transition-colors">{course.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-[#111] flex items-center shadow-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                      Active: <span className="ml-2 font-bold text-white text-sm">{course.activeCount}</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-[#111] flex items-center shadow-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></span>
                      Inactive: <span className="ml-2 font-bold text-white text-sm">{course.inactiveCount}</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-[#111] flex items-center shadow-sm text-gray-300">
                      <Video className="h-3.5 w-3.5 mr-2 text-[#E87C41]" />
                      Modules: <span className="ml-2 font-bold text-white text-sm">{course.totalVideos}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex shrink-0 p-6 rounded-2xl border border-white/10 bg-[#111] flex-col items-center justify-center relative overflow-hidden group-hover:border-[#E87C41]/30 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E87C41] to-transparent opacity-50"></div>
                <BarChart3 className="h-8 w-8 text-[#E87C41] mb-2" />
                <span className="text-3xl font-bold text-white">{allStudents.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-500">Total Enrolled</span>
              </div>
            </div>
          </div>
          
          {/* Formal Students Data Table */}
          <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#0a0a0a] shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#111]">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Student Performance Metrics</h2>
                <p className="text-xs font-medium mt-1 text-gray-400 tracking-wider">Detailed engagement data for all enrolled students.</p>
              </div>
              <div className="p-2.5 rounded-xl border border-white/5 bg-[#050505]">
                <TrendingUp className="h-5 w-5 text-[#E87C41]" />
              </div>
            </div>

            <div className="overflow-x-auto">
              {allStudents.length === 0 ? (
                <div className="text-center py-24">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-10 text-white" />
                  <p className="text-sm font-bold text-white uppercase tracking-widest">No Enrollment Data</p>
                  <p className="text-xs mt-2 text-gray-500">Students will appear here once they enroll.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#050505]">
                      <th className="py-5 px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Student Profile</th>
                      <th className="py-5 px-4 font-bold text-[10px] text-center uppercase tracking-[0.2em] text-gray-500">Status</th>
                      <th className="py-5 px-4 font-bold text-[10px] text-center uppercase tracking-[0.2em] text-gray-500 w-48">Completion</th>
                      <th className="py-5 px-4 font-bold text-[10px] text-center uppercase tracking-[0.2em] text-gray-500">Score</th>
                      <th className="py-5 px-4 font-bold text-[10px] text-center uppercase tracking-[0.2em] text-gray-500">Pace</th>
                      <th className="py-5 px-8 font-bold text-[10px] text-center uppercase tracking-[0.2em] text-gray-500">Skips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map((student, idx) => {
                      const isActive = (course.activeStudents || []).some(s => s._id === student._id);
                      const progressPct = course.totalVideos > 0 ? Math.min(100, Math.round(((student.completedVideosCount || 0) / course.totalVideos) * 100)) : 0;
                      return (
                        <tr key={student._id} className="border-b border-white/5 last:border-0 transition-colors duration-300 hover:bg-[#111] group">
                          <td className="py-5 px-8">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-[#E87C41] bg-[#1a1310] border border-[#E87C41]/20 group-hover:scale-105 transition-transform">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-white">{student.name}</div>
                                <div className="text-xs mt-0.5 text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center">
                            {isActive ? (
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[9px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-widest">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex items-center justify-center space-x-4">
                              <div className="w-full rounded-full h-1.5 bg-[#1a1a1a] overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000 ease-out bg-[#E87C41]" style={{ width: `${progressPct}%` }}></div>
                              </div>
                              <span className="text-xs font-bold w-10 text-right text-gray-400 group-hover:text-white transition-colors">{progressPct}%</span>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center">
                            <div className="inline-flex items-center justify-center h-8 px-4 rounded-lg font-bold text-xs border transition-colors duration-300" style={{ 
                              backgroundColor: student.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.05)' : student.performanceScore >= 50 ? 'rgba(232, 124, 65, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                              color: student.performanceScore >= 80 ? '#10b981' : student.performanceScore >= 50 ? '#E87C41' : '#f43f5e',
                              borderColor: student.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : student.performanceScore >= 50 ? 'rgba(232, 124, 65, 0.2)' : 'rgba(244, 63, 94, 0.2)'
                            }}>
                              {student.performanceScore} <span className="opacity-40 ml-1.5 font-medium text-[10px]">/ 100</span>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-center">
                            <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-[#E87C41] transition-colors">
                              <PlayCircle className="h-4 w-4 opacity-50" />
                              <span className="text-sm font-bold">{student.avgSpeed || 1}x</span>
                            </div>
                          </td>
                          <td className="py-5 px-8 text-center">
                            <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-white transition-colors">
                              <Clock className="h-4 w-4 opacity-50" />
                              <span className="text-sm font-bold">{student.totalSkips || 0}</span>
                            </div>
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
      </div>
    </div>
  );
};

export default AdminCourseAnalytics;
