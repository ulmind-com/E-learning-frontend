import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Loader2,
  Search,
  Clock,
  BarChart3,
  Tag,
  Star,
  Users,
  Unlock,
  Gem,
  Filter
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const LEVEL_COLORS = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all | free | paid

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/courses`);
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      filterType === 'all' || course.courseType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ─── Minimalist Hero Section ─── */}
      <section className="relative pt-6 pb-6 px-4 border-b transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 animate-slide-down">
          <h1 className="hidden" style={{ color: 'var(--text-primary)' }}>
            Explore Courses
          </h1>
          
          <p className="hidden" style={{ color: 'var(--text-secondary)' }}>
            Discover high-quality courses to unlock your potential and elevate your career.
          </p>

          {/* Minimalist Stats - Hidden */}
          <div className="hidden">
            <div className="flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
              <span className="text-3xl md:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>{courses.length}+</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--text-muted)' }}>Courses</span>
            </div>
            <div className="w-px h-10 opacity-50" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
              <span className="text-3xl md:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>500+</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--text-muted)' }}>Students</span>
            </div>
            <div className="w-px h-10 opacity-50" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
              <span className="text-3xl md:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>4.8</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--text-muted)' }}>Rating</span>
            </div>
          </div>

          {/* Premium Filter Pills (Left side) - Removed scrollbar, added flex-wrap */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto md:order-1 p-1 rounded-[2rem] transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            {[
              { key: 'all', label: 'All', icon: Filter },
              { key: 'free', label: 'Free', icon: Unlock },
              { key: 'paid', label: 'Premium', icon: Gem },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = filterType === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`group relative flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-out active:scale-95 ${isActive ? 'shadow-[0_4px_15px_var(--accent-glow-strong)] scale-105' : 'hover:scale-105'}`}
                  style={{
                    backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-500 ${isActive ? 'animate-bounce-subtle' : 'opacity-70 group-hover:rotate-12 group-hover:scale-110'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ultra Premium Search Bar (Right side) */}
          <div className="w-full md:w-[400px] group relative transition-all duration-500 hover:scale-[1.02] md:order-2">
            {/* Dynamic Animated Glow Backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] via-[#10b981] to-[var(--accent)] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-gradient"></div>
            
            <div className="relative flex items-center px-6 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 focus-within:shadow-[0_10px_40px_var(--accent-glow-strong)] focus-within:translate-y-[-2px] glass" 
                 style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              
              <Search className="h-5 w-5 transition-all duration-500 group-focus-within:rotate-90 group-focus-within:scale-125" style={{ color: 'var(--accent)' }} />
              
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search premium courses..."
                className="w-full bg-transparent text-base py-4 pl-4 focus:outline-none font-bold placeholder:font-medium placeholder:opacity-60 transition-all duration-300"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center space-x-3 mb-8 animate-slide-left">
          <GraduationCap className="h-6 w-6 transition-transform duration-500 hover:rotate-12" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Available Courses
          </h2>
          <span
            className="text-sm px-2 py-0.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md"
            style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
          >
            {filteredCourses.length}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <BookOpen className="h-16 w-16 mx-auto mb-4 animate-float" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>
              {search || filterType !== 'all'
                ? 'No courses match your filter'
                : 'No courses available yet'}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {search
                ? 'Try a different search term.'
                : 'Check back later for new courses!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filteredCourses.map((course) => (
              <Link
                to={`/course/${course._id}`}
                key={course._id}
                className="relative flex flex-col p-4 rounded-[24px] transition-all duration-500 hover:-translate-y-3 premium-card-hover group no-underline"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
              >
                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div
                      className="w-full h-full relative overflow-hidden group-hover:scale-110 transition-transform duration-700 ease-out"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none transition-opacity duration-300 group-hover:opacity-70"></div>

                  {/* Rating Pill */}
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg backdrop-blur-sm z-10 transition-transform duration-300 hover:scale-110">
                    {course.rating && course.rating > 0 ? (
                      <>{course.rating.toFixed(1)} <Star className="h-3 w-3 fill-white text-white" /></>
                    ) : (
                      "No rating"
                    )}
                  </div>
                  
                  {/* Course Type Badge */}
                  <div className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm z-10 transition-transform duration-300 hover:scale-110"
                       style={{
                         backgroundColor: course.courseType === 'free' ? 'rgba(34,197,94,0.9)' : 'rgba(99,102,241,0.9)',
                         color: '#fff'
                       }}>
                    {course.courseType === 'free' ? 'FREE' : 'PREMIUM'}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-col flex-grow">
                  
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 mb-2">
                    {course.level && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-300 group-hover:bg-opacity-30"
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
                      <span className="text-xs px-2 py-0.5 rounded-full transition-colors duration-300 group-hover:bg-opacity-100" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--text-secondary)' }}>
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {course.title}
                  </h3>
                  
                  {/* Subtitle / Description */}
                  <p
                    className="text-sm line-clamp-2 mb-4 transition-colors duration-300 group-hover:text-[var(--text-primary)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {course.description || course.category || 'Course Syllabus & Details'}
                  </p>

                  <div className="mt-auto">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      {course.instructor && (
                        <span className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                          <Users className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{course.instructor.name}</span>
                        </span>
                      )}
                      {course.duration && (
                        <span className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                          <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                          <span>{course.duration}</span>
                        </span>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-4 mt-2 transition-all duration-300" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <span className="text-2xl font-black transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" style={{ color: course.courseType === 'free' ? '#22c55e' : 'var(--text-primary)' }}>
                        {course.courseType === 'free' ? 'Free' : `₹${course.price || 0}`}
                      </span>
                      <span className="flex items-center justify-center space-x-1 py-2 px-4 rounded-xl text-sm font-bold text-white transition-all duration-500 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] group-hover:shadow-[0_6px_25px_rgba(99,102,241,0.4)] group-hover:-translate-y-1" style={{ background: 'var(--accent)' }}>
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
