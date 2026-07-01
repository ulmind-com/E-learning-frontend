import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Check,
  X,
  Clock,
  Award,
  Headphones,
  Play,
  Layers,
  ChevronRight,
  Users
} from 'lucide-react';
import SheryiansBg from '../components/SheryiansBg';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';
const BASE_URL = API_URL.replace('/api', '');

const DEFAULT_STATS = {
  stat1Value: '600k',
  stat1Label: 'YouTube Subscribers',
  stat2Value: '01 Million',
  stat2Label: 'Career-Driven Learners'
};

const DEFAULT_COMPARISON = {
  usPoints: [
    'Real-world project-based curriculum',
    'Live doubt sessions with mentors',
    'Placement preparation & mock interviews',
    'Lifetime access to course content',
    'Active student community & networking'
  ],
  othersPoints: [
    'Outdated theory-heavy syllabus',
    'No live mentor interaction',
    'No placement or career support',
    'Limited time-bound access',
    'No community or peer learning'
  ]
};

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const impactScrollRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [landingRes, coursesRes] = await Promise.allSettled([
          axios.get(`${API_URL}/settings/landing`),
          axios.get(`${API_URL}/courses`)
        ]);
        if (landingRes.status === 'fulfilled') {
          setLandingData(landingRes.value.data);
        }
        if (coursesRes.status === 'fulfilled') {
          setCourses(coursesRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = landingData?.stats || DEFAULT_STATS;
  const comparison = landingData?.comparison || DEFAULT_COMPARISON;
  const impact = landingData?.impact || [];
  const video = landingData?.video || { url: '' };

  useEffect(() => {
    const handleScroll = () => {
      if (!impactScrollRef.current) return;
      const section = impactScrollRef.current.closest('section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress between 0 (just entering bottom) and 1 (fully in view)
      let progress = (windowHeight - rect.top) / (windowHeight - rect.height/3);
      progress = Math.max(0, Math.min(1, progress));

      const cards = impactScrollRef.current.querySelectorAll('.impact-card');
      cards.forEach((card, index) => {
        // Scroll from right to left
        const startX = 100 + (index * 40); // cards further right start further away
        const currentX = startX - (startX * progress);

        // Up/down stagger
        const yOffset = index % 2 === 0 ? 30 : -30;
        
        card.style.transform = `translate(${currentX}vw, ${yOffset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial trigger after a short delay to ensure layout
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [impact]);

  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return '';
    if (thumbnail.startsWith('/uploads')) return `${BASE_URL}${thumbnail}`;
    return thumbnail;
  };

  const displayCourses = courses.slice(0, 3);

  const avatars = [
    { bg: '#E87C41', initials: 'AK' },
    { bg: '#6366f1', initials: 'SR' },
    { bg: '#22c55e', initials: 'PM' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <style>{`
        @keyframes hero-slide-up {
          0% { transform: translateY(60px); opacity: 0; filter: blur(8px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes hero-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,124,65,0.3); }
          50% { box-shadow: 0 0 20px 4px rgba(232,124,65,0.15); }
        }
        .anim-slide-up {
          animation: hero-slide-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .anim-fade-in {
          animation: hero-fade-in 0.8s ease forwards;
          opacity: 0;
        }
        .anim-scale-in {
          animation: scale-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .anim-float {
          animation: float-gentle 4s ease-in-out infinite;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
        .delay-7 { animation-delay: 0.7s; }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer-sweep 3s ease-in-out infinite;
        }
        .impact-scroll::-webkit-scrollbar { display: none; }
        .impact-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hover-lift { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
      `}</style>

      <SheryiansBg />

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO BANNER
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center pt-24 pb-20">
          {/* Tagline */}
          <div
            className="anim-slide-up delay-1 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#E87C41]/30 bg-[#E87C41]/5 mb-8"
          >
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ color: '#E87C41' }}
            >
              Learn. Build. Get Placed.
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="anim-slide-up delay-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
          >
            <span className="text-white">Become The Software</span>
            <br className="hidden sm:block" />
            <span className="text-white"> Engineer That </span>
            <span
              className="relative inline-block px-3 py-1 mx-1"
              style={{
                border: '2px solid #E87C41',
                borderRadius: '12px',
                color: '#E87C41'
              }}
            >
              Companies
            </span>
            <br className="hidden sm:block" />
            <span className="text-white"> Want To Hire!</span>
          </h1>

          {/* Subtitle */}
          <p
            className="anim-slide-up delay-3 text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mb-10"
          >
            Join a growing community of students preparing for real-world tech careers at SkillStream.
          </p>



          {/* CTA Button */}
          <Link
            to="/courses"
            className="anim-slide-up delay-5 shimmer-btn inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm sm:text-base font-bold tracking-wide transition-all duration-300 hover:scale-105 no-underline"
            style={{
              backgroundColor: '#E87C41',
              color: '#000',
              animation: 'hero-slide-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards, pulse-glow 3s ease-in-out 1.5s infinite',
              opacity: 0
            }}
          >
            Start Journey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — STATS + VIDEO BENTO GRID
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#111111] border border-[#222] rounded-[16px] p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {/* Stat Card 1 — YouTube */}
              <div
                className="anim-scale-in delay-1 bg-[#050505] border border-[#333] rounded-[12px] p-6 flex flex-col justify-between hover-lift"
                style={{ minHeight: '220px' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-6 rounded-md bg-[#D93025] flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                    </div>
                    <h3 className="text-[28px] font-light tracking-tight text-[#E87C41]">{stats.stat1Value}</h3>
                  </div>
                  <p className="text-[13px] text-gray-300 font-medium">{stats.stat1Label}</p>
                </div>
                <p className="text-[13px] text-gray-200 font-medium mt-8 leading-relaxed max-w-[80%]">
                  Be part of a vibrant learning ecosystem.
                </p>
              </div>

              {/* Stat Card 2 — Rating / Learners */}
              <div
                className="anim-scale-in delay-2 bg-[#050505] border border-[#333] rounded-[12px] p-6 flex flex-col justify-between hover-lift"
                style={{ minHeight: '220px' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-6 h-6 text-[#E87C41] fill-[#E87C41]" />
                    <h3 className="text-[28px] font-light tracking-tight text-[#E87C41]">{stats.stat2Value}</h3>
                  </div>
                  <p className="text-[13px] text-gray-300 font-medium">{stats.stat2Label}</p>
                </div>
                <p className="text-[13px] text-gray-200 font-medium mt-8 leading-relaxed max-w-[80%]">
                  Join a large and growing community of coders.
                </p>
              </div>

              {/* Video / Start Learning Card — spans right */}
              <div
                className="anim-scale-in delay-3 relative rounded-[12px] overflow-hidden md:row-span-2 flex flex-col group border border-[#333] hover-lift"
                style={{ minHeight: '460px' }}
              >
                {/* Background Video */}
                {video.url ? (
                  <video
                    src={video.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : (
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a0f08] to-[#0a0a0a]" />
                )}
                
                {/* Content overlay */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                  <h3 className="text-4xl font-light text-white leading-tight">
                    Start<br/>Learning
                  </h3>
                  
                  <Link
                    to="/courses"
                    className="w-fit mt-auto px-5 py-2.5 rounded-lg border border-gray-500 bg-black/60 backdrop-blur-xl text-sm font-bold text-[#FF5500] hover:bg-black/80 transition-colors flex items-center gap-2 no-underline"
                  >
                    Get in touch <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Bottom-left wide card — Unlock */}
              <div
                className="anim-scale-in delay-4 bg-[#050505] border border-[#333] rounded-[12px] p-6 md:col-span-2 flex flex-col justify-between hover-lift"
                style={{ minHeight: '220px' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-light text-white tracking-tight">UNLOCK</span>
                  <div className="flex items-center -space-x-2">
                    <img src="https://i.pravatar.cc/100?img=1" className="w-7 h-7 rounded-full border border-black grayscale opacity-70" alt="avatar" />
                    <img src="https://i.pravatar.cc/100?img=2" className="w-7 h-7 rounded-full border border-black grayscale opacity-70" alt="avatar" />
                    <img src="https://i.pravatar.cc/100?img=3" className="w-7 h-7 rounded-full border border-black grayscale opacity-70" alt="avatar" />
                    <img src="https://i.pravatar.cc/100?img=4" className="w-7 h-7 rounded-full border border-black grayscale opacity-70" alt="avatar" />
                  </div>
                  <span className="text-3xl font-light text-white tracking-tight">YOUR</span>
                </div>
                
                <Link to="/courses" className="w-[100px] h-8 rounded-full border border-gray-500 flex items-center justify-center group hover:bg-[#E87C41] hover:border-[#E87C41] transition-colors no-underline mb-6">
                  <ArrowRight className="w-4 h-4 text-white transition-colors" />
                </Link>

                <h2 className="text-3xl font-light text-white leading-[1.1] tracking-tight">
                  FIRST JOB AND<br/>INTERNSHIP WITH US!
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — IMPACT / MEMORIES GALLERY
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 md:pb-28 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#E87C41' }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Impact
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
              How We Are Doing It Faster And Better Than Others!
            </h2>
          </div>

          {/* Gallery */}
          {impact.length > 0 ? (
            <div
              ref={impactScrollRef}
              className="impact-scroll flex gap-4 md:gap-5 overflow-visible pb-4"
            >
              {impact.map((item, i) => {
                const isFeatured = i === 2;
                const imgSrc =
                  typeof item === 'string'
                    ? (item.startsWith('/uploads') ? `${BASE_URL}${item}` : item)
                    : (item.imageUrl
                        ? (item.imageUrl.startsWith('/uploads') ? `${BASE_URL}${item.imageUrl}` : item.imageUrl)
                        : '');
                const title = typeof item === 'object' ? item.title || '' : '';
                const desc = typeof item === 'object' ? item.description || '' : '';

                return (
                  <div
                    key={i}
                    className="impact-card flex-shrink-0 relative rounded-[24px] overflow-hidden group cursor-pointer"
                    style={{
                      width: isFeatured ? '420px' : '360px',
                      height: isFeatured ? '500px' : '440px',
                      transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={title || `Impact ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    )}
                    {/* Overlay gradient (Burnt Orange style) - Fills from bottom */}
                    <div
                      className="absolute inset-0 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      style={{
                        background: 'linear-gradient(to top, rgba(232,124,65,0.95) 0%, rgba(232,124,65,0.4) 60%, transparent 100%)'
                      }}
                    />
                    
                    {/* Top elements (Tag + Arrow) */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] -translate-y-10 group-hover:translate-y-0 delay-[50ms]">
                      <div className="bg-[#E87C41] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg">
                        <Star className="w-4 h-4" />
                        {typeof item === 'object' && item.tag ? item.tag : 'Seminar'}
                      </div>
                      
                      <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Bottom overlay text */}
                    {(title || desc) && (
                      <div className="absolute bottom-0 left-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-16 group-hover:translate-y-0 delay-[100ms]">
                        {title && (
                          <h4 className="text-white font-bold text-[24px] mb-2 leading-tight">{title}</h4>
                        )}
                        {desc && (
                          <p className="text-white/95 text-[15px] leading-relaxed line-clamp-3 font-medium">{desc}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 rounded-2xl border border-white/5 bg-[#0a0a0a]">
              <div className="text-center">
                <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Impact gallery coming soon</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — COMPARISON TABLE
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#E87C41' }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Comparison
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
              What Sets SkillStream Apart From Other Coders
            </h2>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SkillStream Card */}
            <div
              className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8 hover-lift"
              style={{ borderLeft: '4px solid #22c55e' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E87C41' }}>
                  <Layers className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-bold text-white">SkillStream</span>
              </div>
              <ul className="space-y-4">
                {(comparison.usPoints || DEFAULT_COMPARISON.usPoints).map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <span className="text-sm text-gray-300 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Others Card */}
            <div
              className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8 hover-lift"
              style={{ borderLeft: '4px solid #ef4444' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-lg font-bold text-white">Others</span>
              </div>
              <ul className="space-y-4">
                {(comparison.othersPoints || DEFAULT_COMPARISON.othersPoints).map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center mt-0.5">
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="text-sm text-gray-400 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 5 — COURSES PREVIEW
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10">
        {/* Top button */}
        <div className="flex justify-center pb-10 px-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold no-underline transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#E87C41', color: '#000' }}
          >
            Explore Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cream Section */}
        <div style={{ backgroundColor: '#F3E8DE' }} className="py-16 md:py-24 px-4 sm:px-6 rounded-[40px] md:rounded-[64px] mx-2 sm:mx-6 my-10 md:my-16">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 h-56 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-[#E87C41] rounded-full animate-spin" />
                  </div>
                ))}
              </div>
            ) : displayCourses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No courses available yet. Check back soon!</p>
              </div>
            ) : (
              displayCourses.map((course, index) => {
                const thumbUrl = getThumbnailUrl(course.thumbnail);
                const isFree = course.courseType === 'free';
                const price = course.price || 0;
                const originalPrice = price > 0 ? Math.floor(price * 2.13) : 0;
                
                const styleConfig = (() => {
                  switch(index) {
                    case 0: return {
                      cardBg: 'bg-white border-gray-100', titleColor: 'text-gray-900', descColor: 'text-gray-500', badgeBg: 'bg-gray-100', badgeText: 'text-gray-700', priceLabel: 'text-gray-500', priceColor: 'text-[#E87C41]', btnBg: 'bg-black', btnText: 'text-white', btnHoverBg: 'bg-[#E87C41]', btnHoverText: 'group-hover:text-white', topOffset: '100px', shadow: 'shadow-xl'
                    };
                    case 1: return {
                      cardBg: 'bg-[#E87C41] border-transparent', titleColor: 'text-white', descColor: 'text-white/95', badgeBg: 'bg-black/20', badgeText: 'text-white', priceLabel: 'text-white/90', priceColor: 'text-white', btnBg: 'bg-black', btnText: 'text-white', btnHoverBg: 'bg-white', btnHoverText: 'group-hover:text-black', topOffset: '140px', shadow: 'shadow-2xl'
                    };
                    default: return {
                      cardBg: 'bg-[#111111] border-gray-800', titleColor: 'text-white', descColor: 'text-gray-400', badgeBg: 'bg-white/10', badgeText: 'text-gray-300', priceLabel: 'text-gray-400', priceColor: 'text-[#E87C41]', btnBg: 'bg-white', btnText: 'text-black', btnHoverBg: 'bg-[#E87C41]', btnHoverText: 'group-hover:text-white', topOffset: '180px', shadow: 'shadow-2xl'
                    };
                  }
                })();

                return (
                  <div
                    key={course._id}
                    className={`sticky rounded-[40px] md:rounded-[48px] ${styleConfig.cardBg} border overflow-hidden ${styleConfig.shadow} flex flex-col md:flex-row`}
                    style={{ top: styleConfig.topOffset }}
                  >
                    {/* Image */}
                    <div className="md:w-[400px] lg:w-[480px] flex-shrink-0 relative overflow-hidden p-4 md:p-6">
                      <div className="w-full h-64 md:h-full rounded-[32px] md:rounded-[40px] overflow-hidden relative">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #1a0f08, #2d1810)' }}
                          >
                            <Layers className="w-12 h-12 text-[#E87C41]/40" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow p-8 sm:p-10 md:p-12 flex flex-col justify-between">
                      <div>
                        <h3 className={`text-2xl sm:text-3xl font-extrabold ${styleConfig.titleColor} mb-4 leading-tight tracking-tight`}>
                          {course.title}
                        </h3>
                        <p className={`text-base ${styleConfig.descColor} leading-relaxed mb-8 line-clamp-2 font-medium`}>
                          {course.description || 'Master in-demand skills with hands-on projects and expert mentorship.'}
                        </p>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 mb-12">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${styleConfig.badgeBg} ${styleConfig.badgeText} text-[13px] font-bold tracking-wide`}>
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration || '3 Months'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${styleConfig.badgeBg} ${styleConfig.badgeText} text-[13px] font-bold tracking-wide`}>
                            <Award className="w-3.5 h-3.5" />
                            Certified
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${styleConfig.badgeBg} ${styleConfig.badgeText} text-[13px] font-bold tracking-wide`}>
                            <Headphones className="w-3.5 h-3.5" />
                            24/7 Support
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-black/5">
                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                          <span className={`text-sm font-semibold uppercase tracking-wider ${styleConfig.priceLabel}`}>Price</span>
                          <span className={`text-3xl font-black tracking-tight ${styleConfig.priceColor}`}>
                            {isFree ? 'Free' : `Rs.${price}`}
                          </span>
                          {!isFree && originalPrice > 0 && (
                            <span className="text-lg text-gray-500 line-through font-medium ml-2">
                              Rs.{originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Button */}
                        <Link
                          to={`/course/${course._id}`}
                          className={`relative group inline-flex items-center gap-2 px-8 py-4 rounded-full ${styleConfig.btnBg} text-sm font-bold overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 no-underline`}
                        >
                          {/* Sliding background */}
                          <div className={`absolute inset-0 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${styleConfig.btnHoverBg}`} />
                          {/* Content */}
                          <span className={`relative z-10 flex items-center gap-2 ${styleConfig.btnText} ${styleConfig.btnHoverText} transition-colors duration-300`}>
                            Check Course
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 6 — CTA BANNER
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10">
        <div
          className="py-20 md:py-28 px-4 sm:px-6"
          style={{
            background: 'linear-gradient(135deg, #E87C41 0%, #d4632a 50%, #c05520 100%)'
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Get started today and transform your career with industry-ready skills.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-sm sm:text-base font-bold hover:bg-gray-900 transition-all duration-300 hover:scale-105 no-underline"
            >
              Join Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
