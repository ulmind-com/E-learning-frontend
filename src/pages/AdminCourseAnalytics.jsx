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
  AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminCourseAnalytics = () => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  // Try to get course from location state, otherwise we'd need to fetch it
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
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-16 w-16 mb-4 opacity-50" style={{ color: 'var(--danger)' }} />
        <h2 className="text-xl font-bold mb-4">Error loading course</h2>
        <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const allStudents = [...(course.activeStudents || []), ...(course.inactiveStudents || [])];

  return (
    <div className="flex-1 p-4 md:p-8 animate-fade-in max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center space-x-2 text-sm font-semibold hover:-translate-x-1 transition-transform"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-2xl border animate-scale-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        {/* Formal Course Header */}
        <div className="p-6 md:p-8 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-6 bg-[var(--bg-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center space-x-5">
            {course.thumbnail ? (
              <img src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail} alt={course.title} className="h-20 w-20 rounded-lg object-cover border shadow-sm" style={{ borderColor: 'var(--border-color)' }} />
            ) : (
              <div className="h-20 w-20 rounded-lg flex items-center justify-center border shadow-sm bg-[var(--bg-input)]" style={{ borderColor: 'var(--border-color)' }}>
                <BookOpen className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
            <div>
              <h3 className="font-bold text-2xl tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-[var(--bg-card)] flex items-center shadow-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active: {course.activeCount}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-[var(--bg-card)] flex items-center shadow-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2 opacity-70"></span>Inactive: {course.inactiveCount}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-[var(--bg-card)] flex items-center shadow-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  <Video className="h-3 w-3 mr-1.5" /> Videos: {course.totalVideos}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Students List */}
        <div className="p-4 md:p-6 overflow-x-auto">
          {allStudents.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
              No students enrolled in this course.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider">Student</th>
                  <th className="pb-4 font-bold text-xs text-center uppercase tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-xs text-center uppercase tracking-wider w-40">Course Progress</th>
                  <th className="pb-4 font-bold text-xs text-center uppercase tracking-wider">Perf. Score</th>
                  <th className="pb-4 font-bold text-xs text-center uppercase tracking-wider">Avg Speed</th>
                  <th className="pb-4 font-bold text-xs text-center uppercase tracking-wider">Skips</th>
                  <th className="pb-4 font-bold text-xs text-right uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map(student => {
                  const isActive = (course.activeStudents || []).some(s => s._id === student._id);
                  const progressPct = course.totalVideos > 0 ? Math.min(100, Math.round(((student.completedVideosCount || 0) / course.totalVideos) * 100)) : 0;
                  return (
                    <tr key={student._id} className="border-b last:border-0 hover:bg-[var(--bg-input)] transition-all" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm bg-[var(--text-secondary)]">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{student.name}</div>
                            <div className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        {isActive ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase tracking-wide">Active</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 uppercase tracking-wide">Inactive</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? '#22c55e' : 'var(--text-primary)' }}></div>
                          </div>
                          <span className="text-xs font-bold w-8 text-right" style={{ color: 'var(--text-secondary)' }}>{progressPct}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="inline-flex items-center justify-center h-7 px-3 rounded-md font-black text-xs shadow-sm border" style={{ 
                          backgroundColor: student.performanceScore >= 80 ? 'rgba(34, 197, 94, 0.1)' : student.performanceScore >= 50 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: student.performanceScore >= 80 ? '#22c55e' : student.performanceScore >= 50 ? '#eab308' : '#ef4444',
                          borderColor: student.performanceScore >= 80 ? 'rgba(34, 197, 94, 0.2)' : student.performanceScore >= 50 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                        }}>
                          {student.performanceScore} / 100
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{student.avgSpeed || 1}x</td>
                      <td className="py-4 px-2 text-center text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{student.totalSkips || 0}</td>
                      <td className="py-4 pl-2 text-right">
                        <button
                          onClick={() => fetchAIReport(student._id, course._id, student.name)}
                          className="relative inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all border group overflow-hidden"
                          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          <div className="absolute inset-0 w-0 bg-[var(--text-primary)] transition-all duration-300 ease-out group-hover:w-full"></div>
                          <Sparkles className="h-3.5 w-3.5 relative z-10 transition-colors group-hover:text-[var(--bg-primary)]" />
                          <span className="relative z-10 transition-colors group-hover:text-[var(--bg-primary)]">AI Analyze</span>
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

      {/* AI Analysis Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--bg-card)] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border animate-scale-in max-h-[90vh] overflow-y-auto" style={{ borderColor: 'var(--border-color)' }}>
            <button 
              onClick={() => setShowAIModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-input)] transition-colors"
            >
              <X className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
            </button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(217,70,239,0.1))' }}>
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Performance Analysis</h3>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Student: {selectedAIStudent}</p>
              </div>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Generating detailed AI report...</p>
              </div>
            ) : aiReport ? (
              aiReport.error ? (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{aiReport.error}</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] bg-[var(--bg-input)] p-6 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                  <div dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br/>') }} />
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseAnalytics;
