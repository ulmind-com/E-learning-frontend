import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Zap,
  Eye,
  Radio,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-1-r539.onrender.com/api';

const getEmbedUrl = (url) => {
  if (!url) return null;
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  return url;
};

/* ────── Inline CSS for advanced animations ────── */
const advancedStyles = `
  @keyframes mc-hero-glow {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.15); }
  }
  @keyframes mc-orb-drift-1 {
    0% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(80px, -50px) scale(1.15); }
    50% { transform: translate(20px, 40px) scale(0.9); }
    75% { transform: translate(-60px, -10px) scale(1.05); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes mc-orb-drift-2 {
    0% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-70px, 60px) scale(1.2); }
    50% { transform: translate(50px, -30px) scale(0.85); }
    75% { transform: translate(-20px, 50px) scale(1.1); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes mc-orb-drift-3 {
    0% { transform: translate(0, 0) scale(1); opacity: 0.06; }
    33% { transform: translate(40px, 70px) scale(1.3); opacity: 0.1; }
    66% { transform: translate(-60px, -40px) scale(0.8); opacity: 0.04; }
    100% { transform: translate(0, 0) scale(1); opacity: 0.06; }
  }
  @keyframes mc-aurora {
    0% { background-position: 0% 50%; opacity: 0.03; }
    25% { opacity: 0.06; }
    50% { background-position: 100% 50%; opacity: 0.04; }
    75% { opacity: 0.07; }
    100% { background-position: 0% 50%; opacity: 0.03; }
  }
  @keyframes mc-grid-pulse {
    0%, 100% { opacity: 0.02; }
    50% { opacity: 0.04; }
  }
  @keyframes mc-streak-drift {
    0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translateX(200vw) skewX(-15deg); opacity: 0; }
  }
  @keyframes mc-glow-dot {
    0%, 100% { opacity: 0.15; transform: scale(1); box-shadow: 0 0 8px 2px rgba(232,124,65,0.15); }
    50% { opacity: 0.5; transform: scale(1.5); box-shadow: 0 0 20px 6px rgba(232,124,65,0.25); }
  }
  @keyframes mc-diagonal-slide {
    0% { transform: translateX(-100%) rotate(-35deg); opacity: 0; }
    20% { opacity: 0.06; }
    80% { opacity: 0.06; }
    100% { transform: translateX(200%) rotate(-35deg); opacity: 0; }
  }
  @keyframes mc-grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -2%); }
    20% { transform: translate(1%, 3%); }
    30% { transform: translate(-3%, 1%); }
    40% { transform: translate(3%, -1%); }
    50% { transform: translate(-1%, 2%); }
    60% { transform: translate(2%, -3%); }
    70% { transform: translate(-2%, 1%); }
    80% { transform: translate(1%, -2%); }
    90% { transform: translate(3%, 2%); }
  }
  @keyframes mc-line-glow {
    0% { transform: scaleX(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: scaleX(1); opacity: 0.6; }
  }
  @keyframes mc-line-shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes mc-section-reveal {
    0% { opacity: 0; transform: translateY(40px); filter: blur(6px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  .mc-section-hidden {
    opacity: 0;
    transform: translateY(40px);
    filter: blur(6px);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s ease;
  }
  .mc-section-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  @keyframes mc-skeleton-pulse {
    0%, 100% { opacity: 0.6; background-color: rgba(255,255,255,0.08); }
    50% { opacity: 0.3; background-color: rgba(232,124,65,0.08); }
  }
  @keyframes mc-card-reveal {
    0% { opacity: 0; transform: translateY(60px) scale(0.92); filter: blur(8px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes mc-badge-pop {
    0% { opacity: 0; transform: scale(0) rotate(-20deg); }
    50% { transform: scale(1.15) rotate(5deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes mc-shimmer-sweep {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes mc-border-glow {
    0%, 100% { border-color: rgba(232, 124, 65, 0.1); }
    50% { border-color: rgba(232, 124, 65, 0.4); }
  }
  @keyframes mc-modal-entrance {
    0% { opacity: 0; transform: scale(0.85) translateY(40px); filter: blur(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
  }
  @keyframes mc-backdrop-blur {
    0% { opacity: 0; backdrop-filter: blur(0); }
    100% { opacity: 1; backdrop-filter: blur(16px); }
  }
  @keyframes mc-text-slide-up {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes mc-count-scale {
    0% { transform: scale(0); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  @keyframes mc-live-ring {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
    70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  @keyframes mc-gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes mc-dots-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes mc-icon-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes mc-empty-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(2deg); }
    75% { transform: translateY(-6px) rotate(-2deg); }
  }
  @keyframes mc-progress-fill {
    0% { width: 0%; }
    100% { width: var(--progress); }
  }

  .mc-page * { box-sizing: border-box; }

  .mc-card-3d {
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease;
  }
  .mc-card-3d:hover {
    transform: translateY(-10px) scale(1.02) rotateX(2deg);
    box-shadow: 0 30px 60px -15px rgba(232, 124, 65, 0.2), 0 0 40px rgba(232, 124, 65, 0.08);
  }

  .mc-card-3d::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent);
    transform: skewX(-25deg);
    transition: left 0.8s ease;
    pointer-events: none;
    z-index: 10;
  }
  .mc-card-3d:hover::after {
    left: 200%;
  }

  .mc-play-btn {
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .mc-play-btn::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #fff;
    transform: translateX(-100%);
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: -1;
    border-radius: inherit;
  }
  .mc-play-btn:hover::before {
    transform: translateX(0);
  }
  .mc-play-btn:hover {
    color: #000 !important;
  }
  .mc-play-btn:hover svg {
    color: #000 !important;
  }

  .mc-details-link {
    position: relative;
    overflow: hidden;
  }
  .mc-details-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 1px;
    background: #E87C41;
    transition: width 0.3s ease;
  }
  .mc-details-link:hover::after {
    width: 100%;
  }

  .mc-img-zoom {
    transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease;
  }
  .mc-card-3d:hover .mc-img-zoom {
    transform: scale(1.1);
    filter: brightness(1.1);
  }

  .mc-doubt-card {
    transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  }
  .mc-doubt-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.4) !important;
  }

  .mc-live-card {
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }
  .mc-live-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(239, 68, 68, 0.15);
  }
`;

/* ────── Premium Animated Background ────── */
const PremiumBackground = ({ scrollY = 0 }) => (
  <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {/* Aurora mesh gradient - slow flowing */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(125deg, rgba(232,124,65,0.08) 0%, transparent 25%, rgba(245,158,11,0.06) 50%, transparent 75%, rgba(232,80,30,0.05) 100%)',
        backgroundSize: '400% 400%',
        animation: 'mc-aurora 15s ease-in-out infinite',
      }}
    />
    {/* Main orange orb - parallax */}
    <div
      style={{
        position: 'absolute',
        top: `calc(-10% + ${scrollY * 0.08}px)`,
        left: '-8%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 124, 65, 0.14) 0%, rgba(232, 124, 65, 0.04) 40%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'mc-orb-drift-1 25s ease-in-out infinite',
        willChange: 'transform',
      }}
    />
    {/* Amber orb - parallax opposite */}
    <div
      style={{
        position: 'absolute',
        bottom: `calc(-15% - ${scrollY * 0.05}px)`,
        right: '-5%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)',
        filter: 'blur(70px)',
        animation: 'mc-orb-drift-2 30s ease-in-out infinite',
        willChange: 'transform',
      }}
    />
    {/* Deep crimson orb - center drift */}
    <div
      style={{
        position: 'absolute',
        top: `calc(40% - ${scrollY * 0.03}px)`,
        left: '50%',
        marginLeft: '-250px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180, 60, 20, 0.06) 0%, transparent 65%)',
        filter: 'blur(90px)',
        animation: 'mc-orb-drift-3 35s ease-in-out infinite',
        willChange: 'transform',
      }}
    />
    {/* Subtle grid overlay */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        animation: 'mc-grid-pulse 8s ease-in-out infinite',
        transform: `translateY(${scrollY * 0.02}px)`,
      }}
    />

    {/* Horizontal light streaks */}
    <div
      style={{
        position: 'absolute',
        top: '18%',
        left: 0,
        width: '35%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(232,124,65,0.25), rgba(245,158,11,0.15), transparent)',
        animation: 'mc-streak-drift 12s 2s linear infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '55%',
        left: 0,
        width: '25%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), rgba(232,124,65,0.15), transparent)',
        animation: 'mc-streak-drift 16s 6s linear infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '78%',
        left: 0,
        width: '30%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.18), rgba(232,124,65,0.1), transparent)',
        animation: 'mc-streak-drift 14s 9s linear infinite',
      }}
    />

    {/* Glowing accent dots */}
    {[
      { top: '12%', left: '15%', delay: '0s', size: 4 },
      { top: '35%', left: '85%', delay: '2s', size: 3 },
      { top: '60%', left: '8%', delay: '4s', size: 3 },
      { top: '75%', left: '70%', delay: '1s', size: 4 },
      { top: '25%', left: '55%', delay: '3s', size: 3 },
      { top: '88%', left: '40%', delay: '5s', size: 3 },
    ].map((dot, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: dot.top,
          left: dot.left,
          width: `${dot.size}px`,
          height: `${dot.size}px`,
          borderRadius: '50%',
          background: '#E87C41',
          animation: `mc-glow-dot 4s ${dot.delay} ease-in-out infinite`,
        }}
      />
    ))}

    {/* Diagonal light accent */}
    <div
      style={{
        position: 'absolute',
        top: '30%',
        left: 0,
        width: '150%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(232,124,65,0.08) 20%, rgba(245,158,11,0.12) 50%, rgba(232,124,65,0.08) 80%, transparent 100%)',
        animation: 'mc-diagonal-slide 20s 3s linear infinite',
      }}
    />

    {/* Film grain texture */}
    <div
      style={{
        position: 'absolute',
        inset: '-50%',
        width: '200%',
        height: '200%',
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
        animation: 'mc-grain 0.8s steps(8) infinite',
        pointerEvents: 'none',
      }}
    />

    {/* Vignette overlay for depth */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)',
      }}
    />
  </div>
);

const MyCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [recentDoubts, setRecentDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const cardRefs = useRef([]);
  const sectionRefs = useRef([]);

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

  /* ── Scroll listener for parallax ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Intersection Observer for stagger-reveal cards ── */
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setVisibleCards((prev) => new Set([...prev, idx]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, courses]);

  /* ── Intersection Observer for section scroll reveals ── */
  useEffect(() => {
    if (loading) return;
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sid = entry.target.dataset.section;
            setVisibleSections((prev) => new Set([...prev, sid]));
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    sectionRefs.current.forEach((el) => {
      if (el) sectionObserver.observe(el);
    });

    return () => sectionObserver.disconnect();
  }, [loading, courses]);

  if (loading) {
    return (
      <div className="mc-page" style={{ minHeight: '100vh', backgroundColor: '#050505', position: 'relative' }}>
        <style>{advancedStyles}</style>
        <PremiumBackground scrollY={0} />
        
        {/* Skeleton Hero Section */}
        <section style={{ position: 'relative', paddingTop: '64px', paddingBottom: '56px', paddingLeft: '16px', paddingRight: '16px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '120px', height: '24px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '300px', height: '48px', borderRadius: '8px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.1s' }} />
            <div style={{ width: '400px', height: '20px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.2s' }} />
            
            <div style={{ display: 'flex', gap: '32px', marginTop: '12px' }}>
              <div style={{ width: '80px', height: '60px', borderRadius: '8px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.3s' }} />
              <div style={{ width: '80px', height: '60px', borderRadius: '8px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.4s' }} />
              <div style={{ width: '80px', height: '60px', borderRadius: '8px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.5s' }} />
            </div>
          </div>
        </section>

        {/* Skeleton Content Section */}
        <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '200px', height: '24px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ 
                height: '380px', 
                borderRadius: '24px', 
                background: 'linear-gradient(180deg, rgba(30,20,15,0.6) 0%, #050505 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{ height: '180px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: `${i * 0.1}s` }} />
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                  <div style={{ width: '80%', height: '20px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: `${i * 0.1 + 0.1}s` }} />
                  <div style={{ width: '60%', height: '16px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: `${i * 0.1 + 0.2}s` }} />
                  <div style={{ marginTop: 'auto', width: '100%', height: '16px', borderRadius: '4px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: `${i * 0.1 + 0.3}s` }} />
                  <div style={{ width: '100%', height: '48px', borderRadius: '12px', marginTop: '12px', animation: 'mc-skeleton-pulse 1.5s infinite ease-in-out', animationDelay: `${i * 0.1 + 0.4}s` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
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
    <div className="mc-page" style={{ minHeight: '100vh', backgroundColor: '#050505', position: 'relative' }}>
      <style>{advancedStyles}</style>
      <PremiumBackground scrollY={scrollY} />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section
        style={{
          position: 'relative',
          paddingTop: '64px',
          paddingBottom: '56px',
          paddingLeft: '16px',
          paddingRight: '16px',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232, 124, 65, 0.13) 0%, rgba(20, 10, 5, 0.6) 50%, transparent 100%)',
        }}
      >

        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Tag pill */}
          <div
            style={{
              padding: '6px 20px',
              border: '1px solid rgba(232, 124, 65, 0.3)',
              borderRadius: '4px',
              color: '#E87C41',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: 'rgba(232, 124, 65, 0.05)',
              backdropFilter: 'blur(8px)',
              animation: 'mc-text-slide-up 0.6s ease-out both',
            }}
          >
            MY COURSES
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#fff',
              margin: 0,
              animation: 'mc-text-slide-up 0.7s 0.1s ease-out both',
            }}
          >
            Your Learning
            <span style={{ color: '#E87C41' }}> Journey</span> Awaits
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '500px',
              lineHeight: 1.6,
              margin: 0,
              animation: 'mc-text-slide-up 0.7s 0.2s ease-out both',
            }}
          >
            Access your purchased courses, watch videos, and track progress — all in one place.
          </p>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              marginTop: '12px',
              animation: 'mc-text-slide-up 0.7s 0.3s ease-out both',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#E87C41',
                  animation: 'mc-count-scale 0.5s 0.6s ease-out both',
                }}
              >
                {courses.length}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Courses
              </span>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#E87C41',
                  animation: 'mc-count-scale 0.5s 0.7s ease-out both',
                }}
              >
                {courses.reduce((acc, c) => acc + (c.chapters?.length || 0), 0)}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Chapters
              </span>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#E87C41',
                  animation: 'mc-count-scale 0.5s 0.8s ease-out both',
                }}
              >
                {upcomingLiveClasses.length}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Live Classes
              </span>
            </div>
          </div>
        </div>
        {/* Animated accent line under hero */}
        <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px', overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(232,124,65,0.5) 30%, rgba(245,158,11,0.6) 50%, rgba(232,124,65,0.5) 70%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'mc-line-shimmer 4s linear infinite',
            }}
          />
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Error */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              marginBottom: '32px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              animation: 'mc-card-reveal 0.5s ease-out both',
            }}
          >
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ─── Recently Solved Doubts ─── */}
        {!loading && recentDoubts.length > 0 && (
          <div
            ref={(el) => (sectionRefs.current[0] = el)}
            data-section="doubts"
            className={visibleSections.has('doubts') ? 'mc-section-visible' : 'mc-section-hidden'}
            style={{ marginBottom: '48px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: '#22c55e' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Recently Solved Doubts
              </h2>
              <span
                style={{
                  fontSize: '10px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                LAST 24H
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {recentDoubts.map((doubt, i) => (
                <div
                  key={doubt._id}
                  className="mc-doubt-card"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(34, 197, 94, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.04) 0%, rgba(5,5,5,0.95) 100%)',
                    animation: `mc-card-reveal 0.5s ${0.1 + i * 0.08}s ease-out both`,
                  }}
                >
                  {/* Green accent bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '3px',
                      height: '100%',
                      background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', paddingLeft: '8px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {doubt.course?.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Solved
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', paddingLeft: '8px', fontStyle: 'italic', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 14px 0' }}>
                    "{doubt.questionText}"
                  </p>
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      marginLeft: '8px',
                      background: 'rgba(34, 197, 94, 0.04)',
                      border: '1px solid rgba(34, 197, 94, 0.12)',
                    }}
                  >
                    <h4 style={{ fontSize: '9px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', margin: '0 0 6px 0' }}>
                      Admin Reply
                    </h4>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                      {doubt.adminReplyText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Upcoming Live Classes ─── */}
        {!loading && upcomingLiveClasses.length > 0 && (
          <div
            ref={(el) => (sectionRefs.current[1] = el)}
            data-section="live"
            className={visibleSections.has('live') ? 'mc-section-visible' : 'mc-section-hidden'}
            style={{ marginBottom: '48px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Radio style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Upcoming Live Classes
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {upcomingLiveClasses.map((lc, i) => {
                const isLive = lc.status === 'live';
                return (
                  <div
                    key={lc._id}
                    className="mc-live-card"
                    style={{
                      padding: '22px',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isLive
                        ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(5,5,5,0.95) 100%)'
                        : 'linear-gradient(180deg, rgba(30, 20, 15, 0.5) 0%, #050505 100%)',
                      border: isLive
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : '1px solid rgba(255,255,255,0.06)',
                      animation: `mc-card-reveal 0.5s ${0.1 + i * 0.08}s ease-out both`,
                    }}
                  >
                    {/* Red accent bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '3px',
                        height: '100%',
                        background: isLive
                          ? 'linear-gradient(180deg, #ef4444, #dc2626)'
                          : 'linear-gradient(180deg, rgba(239, 68, 68, 0.5), rgba(239, 68, 68, 0.2))',
                        borderRadius: '0 2px 2px 0',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ fontWeight: 700, color: '#fff', margin: 0, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                        {lc.title}
                      </h3>
                      {isLive && (
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            flexShrink: 0,
                            animation: 'mc-live-ring 1.5s infinite',
                          }}
                        />
                      )}
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', margin: '0 0 4px 0' }}>
                      {new Date(lc.date).toLocaleString()}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Course: {lc.courseTitle}
                    </p>
                    <Link
                      to={`/live/${lc.courseId}/${lc.chapterId}/${lc._id}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        width: '100%',
                        padding: '10px 0',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#fff',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        background: isLive
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : 'linear-gradient(135deg, #1a1a1a, #111)',
                        border: isLive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isLive ? '0 4px 20px rgba(239, 68, 68, 0.3)' : 'none',
                      }}
                    >
                      {isLive ? '🔴 Join Live Now' : 'Enter Waiting Room'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Section Title ─── */}
        <div
          ref={(el) => (sectionRefs.current[2] = el)}
          data-section="enrolled"
          className={visibleSections.has('enrolled') ? 'mc-section-visible' : 'mc-section-hidden'}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}
        >
          <Sparkles style={{ width: '20px', height: '20px', color: '#E87C41' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
            My Enrolled Courses
          </h2>
        </div>

        {/* ═══════════════ COURSE CARDS GRID ═══════════════ */}
        {courses.length === 0 && !error ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              animation: 'mc-card-reveal 0.6s ease-out both',
            }}
          >
            <BookOpen
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                color: 'rgba(232, 124, 65, 0.3)',
                animation: 'mc-empty-float 4s ease-in-out infinite',
              }}
            />
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
              No courses yet
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
              You haven't purchased any courses. Browse and buy one to get started!
            </p>
            <Link
              to="/"
              className="btn-sweep"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                color: '#fff',
                background: '#E87C41',
              }}
            >
              <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Browse Courses <ArrowRight style={{ width: '16px', height: '16px' }} />
              </span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))',
              gap: '28px',
            }}
          >
            {courses.map((course, index) => (
              <div
                key={course._id}
                ref={(el) => (cardRefs.current[index] = el)}
                data-idx={index}
                className="mc-card-3d"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'linear-gradient(180deg, rgba(30, 20, 15, 0.6) 0%, #050505 100%)',
                  border: '1px solid rgba(232, 124, 65, 0.12)',
                  opacity: visibleCards.has(index) ? 1 : 0,
                  transform: visibleCards.has(index) ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.92)',
                  filter: visibleCards.has(index) ? 'blur(0)' : 'blur(8px)',
                  transition: `opacity 0.6s ${index * 0.08}s ease-out, transform 0.6s ${index * 0.08}s cubic-bezier(0.23, 1, 0.32, 1), filter 0.6s ${index * 0.08}s ease-out`,
                  overflow: 'hidden',
                }}
              >
                {/* MacOS window dots */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', paddingLeft: '2px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }} />
                </div>

                {/* Thumbnail */}
                <div
                  onClick={() => window.location.href = `/course/${course._id}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="mc-img-zoom"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        background: course.courseType === 'free'
                          ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                          : 'linear-gradient(135deg, #1a0f05 0%, #0d0804 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <GraduationCap style={{ width: '48px', height: '48px', color: 'rgba(232, 124, 65, 0.3)' }} />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Rating pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#fff',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      zIndex: 2,
                      animation: `mc-badge-pop 0.4s ${0.4 + index * 0.1}s ease-out both`,
                    }}
                  >
                    {course.rating && course.rating > 0 ? (
                      <>
                        <Star style={{ width: '12px', height: '12px', fill: '#F59E0B', color: '#F59E0B' }} />
                        {course.rating.toFixed(1)}
                      </>
                    ) : (
                      <>
                        <Star style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.3)' }} />
                        New
                      </>
                    )}
                  </div>

                  {/* OWNED badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#000',
                      background: 'linear-gradient(135deg, #E87C41, #F59E0B)',
                      letterSpacing: '0.1em',
                      zIndex: 2,
                      animation: `mc-badge-pop 0.4s ${0.5 + index * 0.1}s ease-out both`,
                      boxShadow: '0 4px 12px rgba(232, 124, 65, 0.3)',
                    }}
                  >
                    OWNED
                  </div>

                  {/* Play overlay on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.4)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 3,
                    }}
                    className="mc-play-overlay"
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'rgba(232, 124, 65, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(232, 124, 65, 0.4)',
                      }}
                    >
                      <Play style={{ width: '22px', height: '22px', color: '#fff', marginLeft: '3px' }} />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0 4px' }}>
                  {/* Tags Row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    {course.level && (
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'transparent',
                          letterSpacing: '0.05em',
                          fontWeight: 500,
                        }}
                      >
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    )}
                    {course.category && course.category !== 'General' && (
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'transparent',
                          letterSpacing: '0.05em',
                          fontWeight: 500,
                        }}
                      >
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => window.location.href = `/course/${course._id}`}
                    style={{
                      fontSize: '19px',
                      fontWeight: 600,
                      color: '#fff',
                      marginBottom: '10px',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      letterSpacing: '0.01em',
                      margin: '0 0 10px 0',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#E87C41')}
                    onMouseLeave={(e) => (e.target.style.color = '#fff')}
                  >
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.4)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: '0 0 18px 0',
                    }}
                  >
                    {course.description || 'Course Syllabus & Details'}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    {/* Meta Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>
                      {course.instructor && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Users style={{ width: '13px', height: '13px', color: '#E87C41' }} />
                          <span style={{ color: 'rgba(255,255,255,0.55)' }}>{course.instructor.name}</span>
                        </span>
                      )}
                      {course.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock style={{ width: '13px', height: '13px', color: '#E87C41' }} />
                          <span>{course.duration}</span>
                        </span>
                      )}
                      {course.chapters && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <BookOpen style={{ width: '13px', height: '13px', color: '#E87C41' }} />
                          <span>{course.chapters.length} chapters</span>
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <button
                        onClick={() => setActiveCourse(course)}
                        className="mc-play-btn"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '11px 0',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#fff',
                          background: '#E87C41',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 14px rgba(232, 124, 65, 0.3)',
                        }}
                      >
                        <Play style={{ width: '16px', height: '16px' }} />
                        <span>Play</span>
                      </button>
                      <Link
                        to={`/course/${course._id}`}
                        className="mc-details-link"
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.45)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          transition: 'color 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '11px 16px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#E87C41')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                      >
                        Details
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════ VIDEO PLAYER MODAL ═══════════════ */}
      {activeCourse && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.85)',
            animation: 'mc-backdrop-blur 0.3s ease-out both',
            backdropFilter: 'blur(16px)',
          }}
          onClick={() => setActiveCourse(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#0a0a0a',
              border: '1px solid rgba(232, 124, 65, 0.2)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(232, 124, 65, 0.1)',
              animation: 'mc-modal-entrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(232, 124, 65, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #E87C41, #F59E0B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play style={{ width: '14px', height: '14px', color: '#000', marginLeft: '2px' }} />
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#fff',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '500px',
                  }}
                >
                  {activeCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {/* Video area */}
            {activeCourse.videos && activeCourse.videos.length > 0 && activeCourse.videos[0].videoUrl ? (
              (() => {
                const firstVideo = activeCourse.videos[0];
                let url = firstVideo.videoUrl;
                if (url && url.startsWith('/uploads')) {
                  url = `https://e-learning-backend-1-r539.onrender.com${url}`;
                } else {
                  url = getEmbedUrl(url);
                }
                const isYT = url && url.includes('youtube.com/embed/');
                return isYT ? (
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                    <iframe
                      src={url}
                      title={firstVideo.title || activeCourse.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video controls autoPlay style={{ width: '100%', aspectRatio: '16/9', background: '#000' }} src={url}>
                    Your browser does not support the video tag.
                  </video>
                );
              })()
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '16/9',
                  background: '#050505',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  gap: '12px',
                }}
              >
                <Eye style={{ width: '40px', height: '40px', color: 'rgba(232, 124, 65, 0.3)' }} />
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
