import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Play,
  Loader2,
  AlertCircle,
  GraduationCap,
  X,
  Clock,
  Tag,
  CheckCircle,
  Star,
  Users,
  ArrowRight,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const LEVEL_COLORS = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

const getEmbedUrl = (url) => {
  if (!url) return null;
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  return url;
};

const MyCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [recentDoubts, setRecentDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/courses/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your courses');
      }
    };
    
    const fetchRecentDoubts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/doubts/student/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentDoubts(data);
      } catch (err) {
        console.error('Failed to load recent doubts', err);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchMyCourses(), fetchRecentDoubts()]);
      setLoading(false);
    };

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  const upcomingLiveClasses = courses.reduce((acc, course) => {
    if (course.chapters) {
      course.chapters.forEach(chapter => {
        if (chapter.liveClasses) {
          chapter.liveClasses.forEach(lc => {
            if (lc.status === 'scheduled' || lc.status === 'live') {
              acc.push({ ...lc, courseId: course._id, courseTitle: course.title, chapterId: chapter._id });
            }
          });
        }
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-2 animate-slide-left">
          <GraduationCap className="h-7 w-7" style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            My Courses
          </h1>
          <span
            className="text-sm px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
          >
            {courses.length}
          </span>
        </div>
        <p className="text-sm mb-8 ml-10 animate-slide-left" style={{ color: 'var(--text-muted)', animationDelay: '0.05s' }}>
          Your purchased courses â€” click <strong>Play</strong> to start watching.
        </p>

        {error && (
          <div className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* â”€â”€â”€ Recently Solved Doubts â”€â”€â”€ */}
        {!loading && recentDoubts.length > 0 && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Recently Solved Doubts (Last 24h)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDoubts.map(doubt => (
                <div key={doubt._id} className="p-4 rounded-xl border relative overflow-hidden group shadow-sm hover:shadow-md transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <div className="flex justify-between items-start mb-2 pl-1">
                    <h3 className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{doubt.course?.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">Solved</span>
                  </div>
                  <p className="text-xs mb-3 line-clamp-2 pl-1 italic" style={{ color: 'var(--text-muted)' }}>"{doubt.questionText}"</p>
                  <div className="p-3 rounded-lg border ml-1" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                    <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">Admin Reply</h4>
                    <p className="text-sm font-medium line-clamp-3" style={{ color: 'var(--text-primary)' }}>{doubt.adminReplyText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€â”€ Today's Live Classes â”€â”€â”€ */}
        {!loading && upcomingLiveClasses.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <Clock className="h-5 w-5" style={{ color: '#ef4444' }} />
              <span>Upcoming Live Classes</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingLiveClasses.map(lc => {
                const isLive = lc.status === 'live';
                return (
                  <div key={lc._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{lc.title}</h3>
                      {isLive && <span className="flex h-3 w-3 shrink-0"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                    </div>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">{new Date(lc.date).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-4">Course: {lc.courseTitle}</p>
                    <Link
                      to={`/live/${lc.courseId}/${lc.chapterId}/${lc._id}`}
                      className={`block text-center w-full py-2 rounded-lg text-xs font-bold text-white transition-all no-underline ${isLive ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    >
                      {isLive ? 'Join Live Now' : 'Enter Waiting Room'}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {courses.length === 0 && !error ? (
          <div className="text-center py-20 animate-fade-in">
            <BookOpen className="h-16 w-16 mx-auto mb-4 animate-float" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>No courses yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              You haven't purchased any courses. Browse and buy one to get started!
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg no-underline btn-press"
            >
              <span>Browse Courses</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {courses.map((course) => (
              <div
                key={course._id}
                className="relative flex flex-col p-4 rounded-[24px] transition-all duration-500 hover:-translate-y-2 group no-underline"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
              >
                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 cursor-pointer" onClick={() => window.location.href = `/course/${course._id}`}>
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div
                      className="w-full h-full relative"
                      style={{
                        background: course.courseType === 'free'
                            ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                            : 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)',
                      }}
                    >
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')" }}></div>
                    </div>
                  )}
                  
                  {/* Overlay Gradient for readability of badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

                  {/* Rating Pill */}
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg backdrop-blur-sm z-10">
                    {course.rating && course.rating > 0 ? (
                      <>{course.rating.toFixed(1)} <Star className="h-3 w-3 fill-white text-white" /></>
                    ) : (
                      "No rating"
                    )}
                  </div>
                  
                  {/* Owned Badge */}
                  <div className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm z-10"
                       style={{
                         backgroundColor: 'rgba(34,197,94,0.9)',
                         color: '#fff'
                       }}>
                    OWNED
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-col flex-grow">
                  
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 mb-2">
                    {course.level && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${LEVEL_COLORS[course.level]}15`,
                          color: LEVEL_COLORS[course.level],
                          border: `1px solid ${LEVEL_COLORS[course.level]}30`,
                        }}
                      >
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    )}
                    {course.category && course.category !== 'General' && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--text-secondary)' }}>
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-300 cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => window.location.href = `/course/${course._id}`}
                  >
                    {course.title}
                  </h3>
                  {/* Subtitle / Description */}
                  <p
                    className="text-sm line-clamp-2 mb-4"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {course.description || course.category || 'Course Syllabus & Details'}
                  </p>

                  <div className="mt-auto">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      {course.instructor && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{course.instructor.name}</span>
                        </span>
                      )}
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                          <span>{course.duration}</span>
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-4 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => setActiveCourse(course)}
                        className="flex-1 py-2 px-3 rounded-xl text-sm font-bold text-white transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] group-hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] group-hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer btn-press"
                        style={{ background: 'var(--accent)' }}
                      >
                        <Play className="h-4 w-4" />
                        <span>Play</span>
                      </button>
                      <Link
                        to={`/course/${course._id}`}
                        className="text-sm transition-colors no-underline font-semibold hover:text-[var(--accent)]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* â”€â”€â”€ Video Player Modal â”€â”€â”€ */}
      {activeCourse && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-backdrop"
          style={{ backgroundColor: 'var(--bg-overlay)' }}
          onClick={() => setActiveCourse(null)}
        >
          <div
            className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl animate-modal"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                {activeCourse.title}
              </h3>
              <button
                onClick={() => setActiveCourse(null)}
                className="transition-colors cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeCourse.videos && activeCourse.videos.length > 0 && activeCourse.videos[0].videoUrl ? (
              (() => {
                const firstVideo = activeCourse.videos[0];
                let url = firstVideo.videoUrl;
                if (url && url.startsWith('/uploads')) {
                  url = `http://localhost:5000${url}`;
                } else {
                  url = getEmbedUrl(url);
                }
                const isYT = url && url.includes('youtube.com/embed/');
                return isYT ? (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={url}
                      title={firstVideo.title || activeCourse.title}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <video controls autoPlay className="w-full aspect-video bg-black" src={url}>
                    Your browser does not support the video tag.
                  </video>
                );
              })()
            ) : (
              <div className="flex items-center justify-center aspect-video text-sm" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                No video available for this course.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
