import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Certificate from '../components/Certificate';
import { CheckCircle, Clock, FileText, Send, Award, ArrowRight, ExternalLink, XCircle, Loader2, Code2, Sparkles, AlertCircle, Briefcase, GitBranch, Globe, File } from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

/* ═══════════════ INLINE STYLES ═══════════════ */
const styles = `
  @keyframes ma-orb-1 {
    0% { transform: translate(0,0) scale(1); }
    25% { transform: translate(80px,-50px) scale(1.15); }
    50% { transform: translate(20px,40px) scale(0.9); }
    75% { transform: translate(-60px,-10px) scale(1.05); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes ma-orb-2 {
    0% { transform: translate(0,0) scale(1); }
    25% { transform: translate(-70px,60px) scale(1.2); }
    50% { transform: translate(50px,-30px) scale(0.85); }
    75% { transform: translate(-20px,50px) scale(1.1); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes ma-orb-3 {
    0% { transform: translate(0,0) scale(1); opacity:0.06; }
    33% { transform: translate(40px,70px) scale(1.3); opacity:0.1; }
    66% { transform: translate(-60px,-40px) scale(0.8); opacity:0.04; }
    100% { transform: translate(0,0) scale(1); opacity:0.06; }
  }
  @keyframes ma-aurora {
    0% { background-position: 0% 50%; opacity:0.03; }
    25% { opacity:0.06; }
    50% { background-position: 100% 50%; opacity:0.04; }
    75% { opacity:0.07; }
    100% { background-position: 0% 50%; opacity:0.03; }
  }
  @keyframes ma-grid-pulse {
    0%,100% { opacity:0.02; }
    50% { opacity:0.04; }
  }
  @keyframes ma-streak {
    0% { transform: translateX(-100%) skewX(-15deg); opacity:0; }
    15% { opacity:1; }
    85% { opacity:1; }
    100% { transform: translateX(200vw) skewX(-15deg); opacity:0; }
  }
  @keyframes ma-glow-dot {
    0%,100% { opacity:0.15; transform:scale(1); box-shadow: 0 0 8px 2px rgba(232,124,65,0.15); }
    50% { opacity:0.5; transform:scale(1.5); box-shadow: 0 0 20px 6px rgba(232,124,65,0.25); }
  }
  @keyframes ma-grain {
    0%,100% { transform: translate(0,0); }
    10% { transform: translate(-2%,-2%); }
    20% { transform: translate(1%,3%); }
    30% { transform: translate(-3%,1%); }
    40% { transform: translate(3%,-1%); }
    50% { transform: translate(-1%,2%); }
    60% { transform: translate(2%,-3%); }
    70% { transform: translate(-2%,1%); }
    80% { transform: translate(1%,-2%); }
    90% { transform: translate(3%,2%); }
  }
  @keyframes ma-text-up {
    0% { opacity:0; transform:translateY(30px); filter:blur(4px); }
    100% { opacity:1; transform:translateY(0); filter:blur(0); }
  }
  @keyframes ma-count-pop {
    0% { transform:scale(0); opacity:0; }
    50% { transform:scale(1.3); }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes ma-shimmer-line {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes ma-card-in {
    0% { opacity:0; transform:translateY(50px) scale(0.94); filter:blur(6px); }
    100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
  }
  @keyframes ma-badge-pop {
    0% { opacity:0; transform:scale(0) rotate(-15deg); }
    60% { transform:scale(1.1) rotate(3deg); }
    100% { opacity:1; transform:scale(1) rotate(0); }
  }
  @keyframes ma-pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(232,124,65,0.4); }
    70% { box-shadow: 0 0 0 15px rgba(232,124,65,0); }
    100% { box-shadow: 0 0 0 0 rgba(232,124,65,0); }
  }
  @keyframes ma-float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes ma-spotlight {
    0% { transform: translate(-50%,-50%) rotate(0deg); }
    100% { transform: translate(-50%,-50%) rotate(360deg); }
  }
  @keyframes ma-border-breathe {
    0%,100% { border-color: rgba(232,124,65,0.1); box-shadow: 0 0 0 0 rgba(232,124,65,0); }
    50% { border-color: rgba(232,124,65,0.3); box-shadow: 0 0 30px -5px rgba(232,124,65,0.08); }
  }
  @keyframes ma-step-glow {
    0%,100% { box-shadow: 0 0 0 0 rgba(232,124,65,0.2); }
    50% { box-shadow: 0 0 12px 3px rgba(232,124,65,0.3); }
  }
  @keyframes ma-progress-grow {
    0% { width: 0%; }
  }
  @keyframes ma-skeleton-pulse {
    0%, 100% { opacity: 0.6; background-color: rgba(255,255,255,0.08); }
    50% { opacity: 0.3; background-color: rgba(232,124,65,0.08); }
  }

  .ma-page { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .ma-page * { box-sizing: border-box; }

  .ma-section-hidden {
    opacity:0; transform:translateY(40px); filter:blur(6px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease;
  }
  .ma-section-visible {
    opacity:1; transform:translateY(0); filter:blur(0);
  }

  .ma-task-card {
    transition: transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease, border-color 0.4s ease;
  }
  .ma-task-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 60px -15px rgba(232,124,65,0.18), 0 0 40px rgba(232,124,65,0.06);
    border-color: rgba(232,124,65,0.3) !important;
  }
  .ma-task-card::after {
    content:''; position:absolute; top:0; left:-100%;
    width:60%; height:100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent);
    transform: skewX(-25deg);
    transition: left 0.8s ease;
    pointer-events:none; z-index:10;
  }
  .ma-task-card:hover::after { left:200%; }

  .ma-submit-btn {
    position:relative; overflow:hidden; z-index:1;
  }
  .ma-submit-btn::before {
    content:''; position:absolute; top:0; left:0;
    width:100%; height:100%; background:#fff;
    transform:translateX(-100%);
    transition: transform 0.5s cubic-bezier(0.25,1,0.5,1);
    z-index:-1; border-radius:inherit;
  }
  .ma-submit-btn:hover::before { transform:translateX(0); }
  .ma-submit-btn:hover { color:#000 !important; }
  .ma-submit-btn:hover svg { color:#000 !important; }

  .ma-input-field {
    font-family: 'Inter', system-ui, sans-serif;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }
  .ma-input-field:focus {
    border-color: rgba(232,124,65,0.5) !important;
    box-shadow: 0 0 0 3px rgba(232,124,65,0.1), 0 0 20px rgba(232,124,65,0.05) !important;
    background: rgba(0,0,0,0.6) !important;
  }
  .ma-input-field::placeholder {
    color: rgba(255,255,255,0.25);
  }

  .ma-status-card {
    animation: ma-border-breathe 4s ease-in-out infinite;
  }

  .ma-title-hover {
    transition: color 0.3s ease;
  }
  .ma-task-card:hover .ma-title-hover {
    color: #E87C41 !important;
  }
`;

/* ═══════════════ BACKGROUND ═══════════════ */
const PremiumBg = ({ scrollY = 0 }) => (
  <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
    {/* Aurora mesh */}
    <div style={{
      position:'absolute', inset:0,
      background:'linear-gradient(125deg, rgba(232,124,65,0.08) 0%, transparent 25%, rgba(245,158,11,0.06) 50%, transparent 75%, rgba(232,80,30,0.05) 100%)',
      backgroundSize:'400% 400%', animation:'ma-aurora 15s ease-in-out infinite',
    }} />
    {/* Rotating conic spotlight */}
    <div style={{
      position:'absolute', top:'30%', left:'50%',
      width:'800px', height:'800px',
      background:'conic-gradient(from 0deg, transparent 0%, rgba(232,124,65,0.04) 10%, transparent 20%, transparent 50%, rgba(245,158,11,0.03) 60%, transparent 70%)',
      borderRadius:'50%', filter:'blur(40px)',
      animation:'ma-spotlight 30s linear infinite',
      transform:`translate(-50%,-50%)`,
    }} />
    {/* Orange orb */}
    <div style={{
      position:'absolute', top:`calc(-10% + ${scrollY*0.08}px)`, left:'-8%',
      width:'600px', height:'600px', borderRadius:'50%',
      background:'radial-gradient(circle, rgba(232,124,65,0.14) 0%, rgba(232,124,65,0.04) 40%, transparent 70%)',
      filter:'blur(50px)', animation:'ma-orb-1 25s ease-in-out infinite', willChange:'transform',
    }} />
    {/* Amber orb */}
    <div style={{
      position:'absolute', bottom:`calc(-15% - ${scrollY*0.05}px)`, right:'-5%',
      width:'550px', height:'550px', borderRadius:'50%',
      background:'radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 40%, transparent 70%)',
      filter:'blur(70px)', animation:'ma-orb-2 30s ease-in-out infinite', willChange:'transform',
    }} />
    {/* Crimson orb */}
    <div style={{
      position:'absolute', top:`calc(40% - ${scrollY*0.03}px)`, left:'50%', marginLeft:'-250px',
      width:'500px', height:'500px', borderRadius:'50%',
      background:'radial-gradient(circle, rgba(180,60,20,0.06) 0%, transparent 65%)',
      filter:'blur(90px)', animation:'ma-orb-3 35s ease-in-out infinite', willChange:'transform',
    }} />
    {/* Grid */}
    <div style={{
      position:'absolute', inset:0,
      backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize:'60px 60px', animation:'ma-grid-pulse 8s ease-in-out infinite',
      transform:`translateY(${scrollY*0.02}px)`,
    }} />
    {/* Streaks */}
    <div style={{ position:'absolute', top:'20%', left:0, width:'35%', height:'1px', background:'linear-gradient(90deg, transparent, rgba(232,124,65,0.25), rgba(245,158,11,0.15), transparent)', animation:'ma-streak 12s 2s linear infinite' }} />
    <div style={{ position:'absolute', top:'60%', left:0, width:'25%', height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), rgba(232,124,65,0.15), transparent)', animation:'ma-streak 16s 6s linear infinite' }} />
    <div style={{ position:'absolute', top:'80%', left:0, width:'30%', height:'1px', background:'linear-gradient(90deg, transparent, rgba(245,158,11,0.18), rgba(232,124,65,0.1), transparent)', animation:'ma-streak 14s 9s linear infinite' }} />
    {/* Glow dots */}
    {[
      {top:'15%',left:'12%',delay:'0s',size:4},{top:'40%',left:'88%',delay:'2s',size:3},
      {top:'65%',left:'6%',delay:'4s',size:3},{top:'80%',left:'75%',delay:'1s',size:4},
      {top:'28%',left:'60%',delay:'3s',size:3},{top:'90%',left:'35%',delay:'5s',size:3},
    ].map((d,i) => (
      <div key={i} style={{ position:'absolute', top:d.top, left:d.left, width:`${d.size}px`, height:`${d.size}px`, borderRadius:'50%', background:'#E87C41', animation:`ma-glow-dot 4s ${d.delay} ease-in-out infinite` }} />
    ))}
    {/* Film grain */}
    <div style={{
      position:'absolute', inset:'-50%', width:'200%', height:'200%', opacity:0.025,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize:'128px 128px', animation:'ma-grain 0.8s steps(8) infinite', pointerEvents:'none',
    }} />
    {/* Vignette */}
    <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
  </div>
);

/* ═══════════════ STATUS CONFIGS ═══════════════ */
const STATUS_CONFIG = {
  Approved: {
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#22c55e',
    border: 'rgba(34,197,94,0.25)',
    glow: 'rgba(34,197,94,0.08)',
    label: 'Approved',
    icon: CheckCircle,
    message: 'Congratulations! Your application is approved. Please proceed to complete your assigned tasks below to advance in your internship.',
  },
  Completed: {
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#3b82f6',
    border: 'rgba(59,130,246,0.25)',
    glow: 'rgba(59,130,246,0.08)',
    label: 'Completed',
    icon: Award,
    message: 'Excellent work! You have successfully completed your internship. Your verified certificate is ready for download below.',
  },
  Rejected: {
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#ef4444',
    border: 'rgba(239,68,68,0.25)',
    glow: 'rgba(239,68,68,0.08)',
    label: 'Rejected',
    icon: XCircle,
    message: "Unfortunately, your application was not accepted at this time. Thank you for your interest and we encourage you to apply again in the future.",
  },
  Pending: {
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#f59e0b',
    border: 'rgba(245,158,11,0.25)',
    glow: 'rgba(245,158,11,0.08)',
    label: 'Pending',
    icon: Clock,
    message: 'Your application is currently under review by our team. We appreciate your patience and will notify you via email once it is approved!',
  },
};

const TASK_STATUS = {
  Verified: { accent: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  Submitted: { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  Pending: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
};

/* ═══════════════ COMPONENT ═══════════════ */
const MyApplication = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingTask, setSubmittingTask] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ gitRepo: '', liveLink: '', documentUrl: '' });
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => { fetchApplication(); }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisibleSections((p) => new Set([...p, e.target.dataset.section]));
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    sectionRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loading, application]);

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

  /* ─── LOADING ─── */
  if (loading) return (
    <div className="ma-page" style={{ minHeight:'100vh', backgroundColor:'#050505', position:'relative' }}>
      <style>{styles}</style>
      <PremiumBg scrollY={0} />
      
      {/* Skeleton Hero */}
      <section style={{ position:'relative', padding:'72px 20px 64px', overflow:'hidden' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'24px', position:'relative', zIndex:1 }}>
          <div style={{ width:'120px', height:'24px', borderRadius:'4px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out' }} />
          <div style={{ width:'320px', height:'56px', borderRadius:'8px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:'0.1s' }} />
          <div style={{ width:'400px', height:'20px', borderRadius:'4px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:'0.2s' }} />
          
          <div style={{ display:'flex', gap:'36px', marginTop:'16px', padding:'20px 36px', borderRadius:'16px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width:'80px', height:'50px', borderRadius:'6px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:'0.3s' }} />
            <div style={{ width:'80px', height:'50px', borderRadius:'6px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:'0.4s' }} />
            <div style={{ width:'80px', height:'50px', borderRadius:'6px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:'0.5s' }} />
          </div>
        </div>
      </section>

      {/* Skeleton Content */}
      <section style={{ maxWidth:'1200px', margin:'0 auto', padding:'48px 24px 96px', position:'relative', zIndex:1 }}>
        {/* Status Card Skeleton */}
        <div style={{ height:'160px', borderRadius:'22px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', marginBottom:'56px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:'0.2s' }} />
        
        {/* Tasks Grid Skeleton */}
        <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'32px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out' }} />
          <div style={{ width:'200px', height:'24px', borderRadius:'6px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:'24px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height:'280px', borderRadius:'18px', background:'linear-gradient(180deg, rgba(30,20,15,0.6) 0%, #050505 100%)', border:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', padding:'20px' }}>
              <div style={{ width:'100%', height:'24px', borderRadius:'4px', marginBottom:'20px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:`${i*0.1}s` }} />
              <div style={{ width:'100%', height:'16px', borderRadius:'4px', marginBottom:'12px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:`${i*0.1 + 0.1}s` }} />
              <div style={{ width:'80%', height:'16px', borderRadius:'4px', marginBottom:'auto', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:`${i*0.1 + 0.2}s` }} />
              <div style={{ width:'100%', height:'40px', borderRadius:'10px', animation:'ma-skeleton-pulse 1.5s infinite ease-in-out', animationDelay:`${i*0.1 + 0.3}s` }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  /* ─── NO APPLICATION ─── */
  if (!application) {
    return (
      <div className="ma-page" style={{ minHeight:'100vh', backgroundColor:'#050505', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', padding:'20px' }}>
        <style>{styles}</style>
        <PremiumBg scrollY={0} />
        <div style={{
          maxWidth:'520px', width:'100%', textAlign:'center', padding:'56px 40px',
          background:'linear-gradient(180deg, rgba(30,20,15,0.6) 0%, #050505 100%)',
          border:'1px solid rgba(232,124,65,0.12)', borderRadius:'24px', position:'relative', zIndex:1,
          animation:'ma-card-in 0.6s ease-out both',
        }}>
          {/* MacOS dots */}
          <div style={{ position:'absolute', top:'20px', left:'20px', display:'flex', gap:'6px' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#FF5F56' }} />
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#FFBD2E' }} />
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#27C93F' }} />
          </div>

          <div style={{
            width:'80px', height:'80px', borderRadius:'50%', margin:'0 auto 24px',
            background:'rgba(232,124,65,0.08)', border:'1px solid rgba(232,124,65,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation:'ma-float 3s ease-in-out infinite',
          }}>
            <FileText style={{ width:'36px', height:'36px', color:'#E87C41' }} />
          </div>
          <h2 style={{ fontSize:'28px', fontWeight:800, color:'#fff', marginBottom:'12px', letterSpacing:'-0.02em' }}>
            Not Applied Yet
          </h2>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:'32px' }}>
            You haven't submitted an internship application. Start your journey today and gain real-world experience!
          </p>
          <Link
            to="/apply-internship"
            className="btn-sweep"
            style={{
              display:'inline-flex', alignItems:'center', gap:'10px', padding:'14px 32px',
              borderRadius:'50px', fontSize:'14px', fontWeight:700, textDecoration:'none',
              color:'#fff', background:'#E87C41', border:'none',
            }}
          >
            <span style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', gap:'8px' }}>
              Apply Now <ArrowRight style={{ width:'18px', height:'18px' }} />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── MAIN VIEW ─── */
  const sc = STATUS_CONFIG[application.status] || STATUS_CONFIG.Pending;
  const StatusIcon = sc.icon;

  const completedTasks = application.assignedTasks?.filter(t => t.status === 'Verified').length || 0;
  const totalTasks = application.assignedTasks?.length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="ma-page" style={{ minHeight:'100vh', backgroundColor:'#050505', position:'relative' }}>
      <style>{styles}</style>
      <PremiumBg scrollY={scrollY} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        position:'relative', padding:'72px 20px 64px',
        overflow:'hidden',
        background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,124,65,0.13) 0%, rgba(20,10,5,0.6) 50%, transparent 100%)',
      }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'24px', position:'relative', zIndex:1 }}>
          {/* Tag */}
          <div style={{
            padding:'7px 22px', border:'1px solid rgba(232,124,65,0.3)', borderRadius:'4px',
            color:'#E87C41', fontSize:'11px', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase',
            background:'rgba(232,124,65,0.05)', backdropFilter:'blur(8px)',
            animation:'ma-text-up 0.6s ease-out both',
          }}>
            MY APPLICATION
          </div>

          {/* Title */}
          <h1 style={{
            fontSize:'clamp(32px, 5.5vw, 56px)', fontWeight:800, lineHeight:1.08,
            letterSpacing:'-0.03em', color:'#fff', margin:0,
            animation:'ma-text-up 0.7s 0.1s ease-out both',
          }}>
            Internship <span style={{ background:'linear-gradient(135deg, #E87C41, #F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Tracker</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:'16px', color:'rgba(255,255,255,0.45)', maxWidth:'500px', lineHeight:1.7, margin:0,
            fontWeight:400, animation:'ma-text-up 0.7s 0.2s ease-out both',
          }}>
            Track your internship progress, complete tasks, and earn your certificate.
          </p>

          {/* Stats */}
          <div style={{
            display:'flex', alignItems:'center', gap:'36px', marginTop:'16px',
            padding:'20px 36px', borderRadius:'16px',
            background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
            backdropFilter:'blur(12px)',
            animation:'ma-text-up 0.7s 0.3s ease-out both',
          }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
              <span style={{ fontSize:'24px', fontWeight:800, color:sc.accent, animation:'ma-count-pop 0.5s 0.6s ease-out both', letterSpacing:'-0.02em' }}>
                {application.status}
              </span>
              <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600 }}>Status</span>
            </div>
            <div style={{ width:'1px', height:'40px', background:'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
              <span style={{ fontSize:'28px', fontWeight:800, color:'#E87C41', animation:'ma-count-pop 0.5s 0.7s ease-out both', letterSpacing:'-0.02em' }}>
                {totalTasks}
              </span>
              <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600 }}>Tasks</span>
            </div>
            <div style={{ width:'1px', height:'40px', background:'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
              <span style={{ fontSize:'28px', fontWeight:800, color:'#22c55e', animation:'ma-count-pop 0.5s 0.8s ease-out both', letterSpacing:'-0.02em' }}>
                {progressPercent}%
              </span>
              <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600 }}>Progress</span>
            </div>
          </div>
        </div>

        {/* Shimmer line */}
        <div style={{ position:'absolute', bottom:0, left:'8%', right:'8%', height:'1px', overflow:'hidden' }}>
          <div style={{
            width:'100%', height:'100%',
            background:'linear-gradient(90deg, transparent 0%, rgba(232,124,65,0.5) 30%, rgba(245,158,11,0.6) 50%, rgba(232,124,65,0.5) 70%, transparent 100%)',
            backgroundSize:'200% 100%', animation:'ma-shimmer-line 4s linear infinite',
          }} />
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <section style={{ maxWidth:'1200px', margin:'0 auto', padding:'48px 24px 96px', position:'relative', zIndex:1 }}>

        {/* ─── Status Card ─── */}
        <div
          ref={(el) => (sectionRefs.current[0] = el)}
          data-section="status"
          className={visibleSections.has('status') ? 'ma-section-visible' : 'ma-section-hidden'}
          style={{ marginBottom:'56px' }}
        >
          <div className="ma-status-card" style={{
            borderRadius:'22px', overflow:'hidden', position:'relative',
            background: sc.gradient,
            border:`1px solid ${sc.border}`,
          }}>
            {/* MacOS dots */}
            <div style={{ padding:'18px 22px 0', display:'flex', gap:'7px' }}>
              <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#FF5F56' }} />
              <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#FFBD2E' }} />
              <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#27C93F' }} />
            </div>

            {/* Status header */}
            <div style={{
              padding:'22px 30px', display:'flex', flexWrap:'wrap', gap:'24px',
              justifyContent:'space-between', alignItems:'center',
              borderBottom:`1px solid ${sc.border}`,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'18px' }}>
                <div style={{
                  width:'56px', height:'56px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center',
                  background: sc.glow, border:`1px solid ${sc.border}`,
                  animation:'ma-step-glow 3s ease-in-out infinite',
                }}>
                  <StatusIcon style={{ width:'28px', height:'28px', color:sc.accent }} />
                </div>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'6px' }}>
                    Application Status
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <span style={{ fontSize:'24px', fontWeight:800, color:sc.accent, letterSpacing:'-0.02em' }}>{application.status}</span>
                    <span style={{
                      fontSize:'10px', padding:'4px 12px', borderRadius:'6px', fontFamily:'"JetBrains Mono", monospace',
                      background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                      color:'rgba(255,255,255,0.35)', letterSpacing:'0.02em',
                    }}>
                      ID: {application._id.substring(0, 8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {totalTasks > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'14px', minWidth:'220px' }}>
                  <div style={{ flex:1, height:'5px', borderRadius:'3px', background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                    <div style={{
                      width:`${progressPercent}%`, height:'100%', borderRadius:'3px',
                      background:`linear-gradient(90deg, ${sc.accent}, #E87C41)`,
                      transition:'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                      animation:'ma-progress-grow 1.5s 0.5s ease-out both',
                      boxShadow:`0 0 10px ${sc.accent}40`,
                    }} />
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:800, color:sc.accent, minWidth:'42px', letterSpacing:'-0.01em' }}>{progressPercent}%</span>
                </div>
              )}
            </div>

            {/* Message body */}
            <div style={{ padding:'26px 30px' }}>
              <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.5)', lineHeight:1.8, margin:0, fontWeight:400 }}>
                {sc.message}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tasks Section ─── */}
        {application.status !== 'Pending' && application.status !== 'Rejected' && (
          <div
            ref={(el) => (sectionRefs.current[1] = el)}
            data-section="tasks"
            className={visibleSections.has('tasks') ? 'ma-section-visible' : 'ma-section-hidden'}
            style={{ marginBottom:'56px' }}
          >
            {/* Section header */}
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'32px' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(232,124,65,0.08)', border:'1px solid rgba(232,124,65,0.15)',
              }}>
                <Code2 style={{ width:'18px', height:'18px', color:'#E87C41' }} />
              </div>
              <h2 style={{ fontSize:'22px', fontWeight:700, color:'#fff', margin:0, letterSpacing:'-0.01em' }}>Assigned Tasks</h2>
              <span style={{
                fontSize:'10px', padding:'4px 14px', borderRadius:'20px',
                background:'rgba(232,124,65,0.06)', color:'#E87C41',
                border:'1px solid rgba(232,124,65,0.12)', fontWeight:700, letterSpacing:'0.03em',
              }}>
                {completedTasks}/{totalTasks} Done
              </span>
            </div>

            {application.assignedTasks.length === 0 ? (
              <div style={{
                textAlign:'center', padding:'64px 20px', borderRadius:'20px',
                background:'linear-gradient(180deg, rgba(30,20,15,0.4) 0%, #050505 100%)',
                border:'1px solid rgba(255,255,255,0.06)',
              }}>
                <AlertCircle style={{ width:'48px', height:'48px', color:'rgba(232,124,65,0.3)', margin:'0 auto 16px' }} />
                <p style={{ fontSize:'18px', fontWeight:600, color:'#fff', marginBottom:'8px' }}>No tasks assigned yet</p>
                <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.4)' }}>Check back later when your mentor assigns a new project.</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:'24px' }}>
                {application.assignedTasks.map((t, i) => {
                  const ts = TASK_STATUS[t.status] || TASK_STATUS.Pending;
                  return (
                    <div
                      key={t._id}
                      className="ma-task-card"
                      style={{
                        position:'relative', display:'flex', flexDirection:'column',
                        borderRadius:'18px', overflow:'hidden',
                        background:'linear-gradient(180deg, rgba(30,20,15,0.6) 0%, #050505 100%)',
                        border:'1px solid rgba(232,124,65,0.1)',
                        opacity:0, animation:`ma-card-in 0.6s ${0.1 + i * 0.1}s ease-out forwards`,
                      }}
                    >
                      {/* MacOS dots + step number */}
                      <div style={{ padding:'16px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div style={{ display:'flex', gap:'7px' }}>
                          <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:'#FF5F56' }} />
                          <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:'#FFBD2E' }} />
                          <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:'#27C93F' }} />
                        </div>
                        <div style={{
                          width:'28px', height:'28px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center',
                          background:'rgba(232,124,65,0.06)', border:'1px solid rgba(232,124,65,0.1)',
                          fontSize:'11px', fontWeight:800, color:'#E87C41',
                          animation:`ma-badge-pop 0.4s ${0.2 + i * 0.1}s ease-out both`,
                        }}>
                          {i + 1}
                        </div>
                      </div>

                      {/* Task header */}
                      <div style={{
                        padding:'18px 24px 16px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'14px',
                        borderBottom:'1px solid rgba(255,255,255,0.04)',
                      }}>
                        <h4 className="ma-title-hover" style={{
                          fontSize:'17px', fontWeight:600, color:'#fff', margin:0, lineHeight:1.35,
                          flex:1, overflow:'hidden', textOverflow:'ellipsis',
                          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                          letterSpacing:'-0.01em',
                        }}>
                          {t.task?.title}
                        </h4>
                        <span style={{
                          fontSize:'10px', padding:'5px 14px', borderRadius:'20px', fontWeight:700,
                          background:ts.bg, color:ts.accent, border:`1px solid ${ts.border}`,
                          whiteSpace:'nowrap', flexShrink:0, letterSpacing:'0.04em', textTransform:'uppercase',
                          animation:`ma-badge-pop 0.4s ${0.3 + i * 0.1}s ease-out both`,
                        }}>
                          {t.status}
                        </span>
                      </div>

                      {/* Task body */}
                      <div style={{ padding:'22px 24px', flexGrow:1, display:'flex', flexDirection:'column' }}>
                        <p style={{
                          fontSize:'13.5px', color:'rgba(255,255,255,0.38)', lineHeight:1.65, marginBottom:'22px',
                          flexGrow:1, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden',
                          fontWeight:400,
                        }}>
                          {t.task?.details}
                        </p>

                        {t.task?.referalLink && (
                          <a
                            href={t.task.referalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'12px',
                              fontWeight:600, color:'#E87C41', textDecoration:'none',
                              padding:'8px 16px', borderRadius:'10px',
                              background:'rgba(232,124,65,0.06)', border:'1px solid rgba(232,124,65,0.12)',
                              marginBottom:'20px', width:'fit-content', transition:'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232,124,65,0.12)'; e.currentTarget.style.borderColor = 'rgba(232,124,65,0.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(232,124,65,0.06)'; e.currentTarget.style.borderColor = 'rgba(232,124,65,0.12)'; }}
                          >
                            <ExternalLink style={{ width:'13px', height:'13px' }} /> View Resources
                          </a>
                        )}

                        {/* Submit button */}
                        {t.status === 'Pending' && submittingTask !== t.task?._id && (
                          <button
                            onClick={() => setSubmittingTask(t.task?._id)}
                            className="ma-submit-btn"
                            style={{
                              width:'100%', marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                              padding:'12px', borderRadius:'12px', fontSize:'13px', fontWeight:700,
                              color:'#fff', background:'#E87C41', border:'none', cursor:'pointer',
                              boxShadow:'0 4px 14px rgba(232,124,65,0.3)',
                            }}
                          >
                            <Send style={{ width:'14px', height:'14px' }} /> Submit Task
                          </button>
                        )}

                        {/* Submit form */}
                        {submittingTask === t.task?._id && (
                          <form
                            onSubmit={(e) => submitTask(t.task?._id, e)}
                            style={{
                              marginTop:'auto', display:'flex', flexDirection:'column', gap:'10px',
                              padding:'18px', borderRadius:'14px',
                              background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
                              animation:'ma-card-in 0.3s ease-out both',
                            }}
                          >
                            {[
                              { name:'gitRepo', placeholder:'GitHub Repository URL', icon: GitBranch },
                              { name:'liveLink', placeholder:'Live Demo URL', icon: Globe },
                              { name:'documentUrl', placeholder:'Document/Report URL', icon: File },
                            ].map(({ name, placeholder, icon: Icon }) => (
                              <div key={name} style={{ position:'relative' }}>
                                <Icon style={{
                                  position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)',
                                  width:'14px', height:'14px', color:'rgba(255,255,255,0.25)',
                                }} />
                                <input
                                  required
                                  name={name}
                                  placeholder={placeholder}
                                  value={submissionForm[name]}
                                  onChange={handleSubmissionChange}
                                  className="ma-input-field"
                                  style={{
                                    width:'100%', padding:'11px 12px 11px 36px', fontSize:'13px',
                                    borderRadius:'10px', border:'1px solid rgba(255,255,255,0.08)',
                                    background:'rgba(0,0,0,0.4)', color:'#fff', outline:'none',
                                  }}
                                />
                              </div>
                            ))}
                            <div style={{ display:'flex', gap:'8px', paddingTop:'6px' }}>
                              <button
                                type="submit"
                                style={{
                                  flex:1, padding:'11px', borderRadius:'10px', fontSize:'13px', fontWeight:700,
                                  background:'#E87C41', color:'#fff', border:'none', cursor:'pointer',
                                  display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                                  transition:'all 0.3s ease',
                                }}
                              >
                                <Send style={{ width:'13px', height:'13px' }} /> Submit
                              </button>
                              <button
                                type="button"
                                onClick={() => setSubmittingTask(null)}
                                style={{
                                  flex:1, padding:'11px', borderRadius:'10px', fontSize:'13px', fontWeight:600,
                                  background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)',
                                  border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer',
                                  transition:'all 0.3s ease',
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── Certificate Section ─── */}
        {application.certificateIssued && (
          <div
            ref={(el) => (sectionRefs.current[2] = el)}
            data-section="cert"
            className={visibleSections.has('cert') ? 'ma-section-visible' : 'ma-section-hidden'}
          >
            <div style={{
              borderRadius:'24px', overflow:'hidden', position:'relative',
              background:'linear-gradient(135deg, rgba(232,124,65,0.08) 0%, rgba(245,158,11,0.04) 30%, rgba(5,5,5,0.95) 100%)',
              border:'1px solid rgba(232,124,65,0.15)',
              padding:'56px 24px', textAlign:'center',
            }}>
              {/* Decorative orbs */}
              <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(232,124,65,0.08)', filter:'blur(60px)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(245,158,11,0.06)', filter:'blur(60px)', pointerEvents:'none' }} />

              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{
                  width:'80px', height:'80px', borderRadius:'50%', margin:'0 auto 24px',
                  background:'rgba(232,124,65,0.1)', border:'1px solid rgba(232,124,65,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  animation:'ma-float 3s ease-in-out infinite',
                  boxShadow:'0 0 40px rgba(232,124,65,0.15)',
                }}>
                  <Award style={{ width:'36px', height:'36px', color:'#E87C41', filter:'drop-shadow(0 0 10px rgba(232,124,65,0.4))' }} />
                </div>

                <h2 style={{
                  fontSize:'clamp(28px, 4vw, 44px)', fontWeight:800, color:'#fff',
                  marginBottom:'16px', letterSpacing:'-0.02em',
                }}>
                  Congratulations! <span style={{ display:'inline-block' }}>🎉</span>
                </h2>

                <p style={{
                  fontSize:'15px', color:'rgba(255,255,255,0.5)', maxWidth:'560px', margin:'0 auto 40px',
                  lineHeight:1.7,
                }}>
                  Your dedication and hard work have paid off. Your internship is officially verified and your certificate is ready to showcase your new skills!
                </p>

                <div style={{ display:'flex', justifyContent:'center' }}>
                  <Certificate userName={application.resume.name} issueDate={new Date().toLocaleDateString()} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyApplication;
