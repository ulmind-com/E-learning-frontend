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
import { useAuth } from '../context/AuthContext';
import SheryiansBg from '../components/SheryiansBg';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

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
    <div className="min-h-[calc(100vh-4rem)] bg-transparent" >
      <SheryiansBg />
      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-16 px-4 border-b border-transparent overflow-hidden hero-radial-gradient">
        {/* Background Subtle Dots */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-6 animate-slide-down relative z-10">
          
          {/* Courses Tag */}
          <div className="px-5 py-1.5 border border-[#E87C41]/30 rounded text-[#E87C41] text-xs font-medium tracking-[0.1em] uppercase bg-[#E87C41]/5 backdrop-blur-sm">
            COURSES
          </div>

          <h1 className="text-4xl md:text-[44px] lg:text-[52px] font-bold leading-[1.1] tracking-tight text-white mb-2">
            Level Up Your Coding Skills With <br className="hidden md:block"/> Expert-Led Courses
          </h1>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mt-8 relative z-20">
            {/* Premium Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#111] border border-white/10 shadow-xl">
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
                    className={`group relative flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'bg-[#E87C41] text-white shadow-lg' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Ultra Premium Search Bar */}
            <div className="w-full md:w-[350px] relative">
              <div className="relative flex items-center px-5 rounded-full bg-[#111] border border-white/10 shadow-xl focus-within:border-[#E87C41]/50 transition-colors">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full bg-transparent text-sm py-3 pl-3 focus:outline-none text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-8 pb-24 relative z-10 pt-10">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-[24px] overflow-hidden bg-white/5 border border-white/5 flex flex-col h-[420px]" style={{ animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.1}s` }}>
                <div className="h-[200px] w-full bg-white/5"></div>
                <div className="p-6 flex flex-col flex-grow gap-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-24 bg-white/5 rounded-full"></div>
                    <div className="h-4 w-12 bg-white/5 rounded-full"></div>
                  </div>
                  <div className="h-7 w-[90%] bg-white/10 rounded-md mt-2"></div>
                  <div className="h-4 w-[70%] bg-white/5 rounded-md mb-auto"></div>
                  <div className="h-[1px] w-full bg-white/5 my-1"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-16 bg-white/10 rounded-md"></div>
                    <div className="h-10 w-28 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {filteredCourses.map((course) => (
              <Link
                to={`/course/${course._id}`}
                key={course._id}
                className="relative flex flex-col p-5 rounded-[16px] transition-all duration-500 hover:-translate-y-2 group no-underline"
                style={{
                  background: 'linear-gradient(180deg, rgba(30, 20, 15, 0.6) 0%, #050505 100%)',
                  border: '1px solid rgba(232, 124, 65, 0.15)',
                }}
              >
                {/* MacOS Dots */}
                <div className="flex gap-1.5 mb-4 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                </div>

                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-5 border border-white/5">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full relative overflow-hidden"
                      style={{
                        background: course.courseType === 'free'
                            ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                            : 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)',
                      }}
                    >
                    </div>
                  )}
                  
                  {/* LIVE Badge */}
                  <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-[4px] flex items-center gap-1.5 z-10 shadow-sm tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    LIVE
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-col flex-grow px-1">
                  
                  {/* Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    {course.level && (
                      <span className="text-[10px] px-3 py-1 rounded-full text-gray-300 border border-white/10 bg-transparent tracking-wide">
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    )}
                    {course.category && course.category !== 'General' && (
                      <span className="text-[10px] px-3 py-1 rounded-full text-gray-300 border border-white/10 bg-transparent tracking-wide">
                        {course.category}
                      </span>
                    )}
                    {!course.level && !course.category && (
                      <span className="text-[10px] px-3 py-1 rounded-full text-gray-300 border border-white/10 bg-transparent tracking-wide">
                        Product Building
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[20px] font-semibold mb-6 line-clamp-2 leading-[1.3] text-white tracking-wide"
                  >
                    {course.title}
                  </h3>
                  
                  <div className="mt-auto">
                    {/* Price & Action */}
                    <div className="flex items-end justify-between mb-5">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                           <span className="text-white text-[16px] font-medium">Price</span>
                           <span className="text-[20px] font-medium tracking-tight" style={{ color: '#E87C41' }}>
                             {course.courseType === 'free' ? 'Free' : `Rs.${course.price || 6999}`}
                           </span>
                           {course.courseType !== 'free' && course.price > 0 && (
                             <span className="text-[10px] text-gray-500 line-through ml-1">
                               Rs.{Math.floor((course.price || 6999) * 2.13)}
                             </span>
                           )}
                        </div>
                      </div>
                      {course.courseType !== 'free' && course.price > 0 && (
                        <div className="bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] tracking-widest mb-1">
                           53% OFF
                        </div>
                      )}
                    </div>

                    <div className="pt-1 pb-1">
                      <button className="btn-sweep w-max flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[12px] font-bold transition-all duration-300">
                         <span className="relative z-10 flex items-center gap-2">
                           Check Course <ArrowRight className="w-3.5 h-3.5" />
                         </span>
                      </button>
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
