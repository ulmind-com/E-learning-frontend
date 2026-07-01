import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Certificate from '../components/Certificate';
import { CheckCircle, Clock, FileText, Send, Award, ArrowRight, ExternalLink, XCircle, Loader2, Code2, Sparkles, AlertCircle, Briefcase, GitBranch, Globe, File } from 'lucide-react';
import PremiumBg from '../components/PremiumBg';

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

  @keyframes premium-slide-up {
    0% { opacity: 0; transform: translateY(60px) scale(0.95); filter: blur(10px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes premium-fade-in {
    0% { opacity: 0; filter: blur(5px); }
    100% { opacity: 1; filter: blur(0); }
  }
  @keyframes premium-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  @keyframes premium-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes premium-pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(232,124,65,0.2); }
    50% { box-shadow: 0 0 40px rgba(232,124,65,0.5); }
  }
`;



/* ═══════════════ STATUS CONFIGS ═══════════════ */
const STATUS_CONFIG = {
  Approved: {
    gradient: 'linear-gradient(135deg, rgba(232,124,65,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#E87C41',
    border: 'rgba(232,124,65,0.25)',
    glow: 'rgba(232,124,65,0.08)',
    label: 'Approved',
    icon: CheckCircle,
    message: 'Congratulations! Your application is approved. Please proceed to complete your assigned tasks below to advance in your internship.',
  },
  Completed: {
    gradient: 'linear-gradient(135deg, rgba(253,251,247,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#FDFBF7',
    border: 'rgba(253,251,247,0.25)',
    glow: 'rgba(253,251,247,0.08)',
    label: 'Completed',
    icon: Award,
    message: 'Excellent work! You have successfully completed your internship. Your verified certificate is ready for download below.',
  },
  Rejected: {
    gradient: 'linear-gradient(135deg, rgba(160,157,152,0.12) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#A09D98',
    border: 'rgba(160,157,152,0.25)',
    glow: 'rgba(160,157,152,0.08)',
    label: 'Rejected',
    icon: XCircle,
    message: "Unfortunately, your application was not accepted at this time. Thank you for your interest and we encourage you to apply again in the future.",
  },
  Pending: {
    gradient: 'linear-gradient(135deg, rgba(232,124,65,0.05) 0%, rgba(5,5,5,0.95) 100%)',
    accent: '#E87C41',
    border: 'rgba(232,124,65,0.15)',
    glow: 'rgba(232,124,65,0.05)',
    label: 'Pending',
    icon: Clock,
    message: 'Your application is currently under review by our team. We appreciate your patience and will notify you via email once it is approved!',
  },
};

const TASK_STATUS = {
  Verified: { accent: '#FDFBF7', bg: 'rgba(253,251,247,0.08)', border: 'rgba(253,251,247,0.2)' },
  Submitted: { accent: '#E87C41', bg: 'rgba(232,124,65,0.08)', border: 'rgba(232,124,65,0.2)' },
  Pending: { accent: '#A09D98', bg: 'rgba(160,157,152,0.08)', border: 'rgba(160,157,152,0.2)' },
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

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/internship/my-application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // If backend returns an array, take the first one
      const appData = Array.isArray(res.data) ? res.data[0] : res.data;
      setApplication(appData);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center relative bg-[#000000] overflow-hidden">
        <style>{styles}</style>
        <PremiumBg scrollY={0} />
        
        {/* Dynamic Grid Overlay for Empty State */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(232, 124, 65, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 124, 65, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px', transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-200px)', animation: 'grid-move 20s linear infinite' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full opacity-20 blur-[150px] pointer-events-none" style={{ backgroundColor: '#E87C41' }}></div>

        <div className="relative z-10 max-w-2xl w-full text-center p-12 bg-[#050505] rounded-[2rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group animate-slide-up">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E87C41]/50 to-transparent"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E87C41]/10 mb-8 border border-[#E87C41]/20 group-hover:scale-110 transition-transform duration-500">
            <FileText className="h-10 w-10 text-[#E87C41]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            No Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87C41] to-[#ff9a5a]">Application</span>
          </h2>
          
          <p className="text-sm md:text-base text-gray-400 font-medium max-w-md mx-auto leading-relaxed mb-10">
            Kickstart your tech career by applying for an internship. Work on real-world projects, get mentored by experts, and earn your certificate!
          </p>
          
          <Link
            to="/internships"
            className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#E87C41] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(232,124,65,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 text-black font-black uppercase tracking-[0.1em] text-sm flex items-center gap-2">
              Explore Internships
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
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

      {/* ═══════════════ HEADER & STATUS ═══════════════ */}
      <section className="relative pt-24 pb-12 w-full border-b border-white/5 bg-[#050505] overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] opacity-20 pointer-events-none blur-[120px]" style={{ background: `radial-gradient(circle at 100% 0%, ${sc.accent} 0%, transparent 70%)` }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12" style={{ animation: 'premium-slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <span className="px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm" style={{ backgroundColor: `${sc.accent}10`, borderColor: `${sc.accent}30`, color: sc.accent, animation: 'premium-fade-in 1.2s ease-out both 0.2s' }}>
                   APPLICATION ID: {application?._id ? application._id.substring(0, 8) : 'N/A'}
                 </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight mb-4" style={{ animation: 'premium-slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) both 0.1s' }}>
                Internship Workspace
              </h1>
              
              <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed max-w-xl" style={{ animation: 'premium-slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) both 0.2s' }}>
                Track your progress, submit assignments, and earn your verified certificate upon completion.
              </p>
            </div>
          </div>

          {/* ─── Status Alert & Progress ─── */}
          <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl" style={{ animation: 'premium-slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both 0.3s' }}>
             <div className="p-8 sm:p-10 flex flex-col lg:flex-row gap-10 lg:items-center justify-between relative">
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: sc.accent, boxShadow: `0 0 30px ${sc.accent}` }}></div>
                
                <div className="flex items-start gap-6 max-w-2xl relative z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group transition-transform hover:scale-105" style={{ backgroundColor: `${sc.accent}15`, border: `1px solid ${sc.accent}30` }}>
                    <StatusIcon className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: sc.accent }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                      Status: <span style={{ color: sc.accent }}>{application?.status || 'Unknown'}</span>
                    </h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                      {sc.message}
                    </p>
                  </div>
                </div>

                {totalTasks > 0 && (
                  <div className="w-full lg:w-80 bg-[#111] p-6 rounded-2xl border border-white/5 relative z-10">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Overall Progress</span>
                      <span className="text-2xl font-black tracking-tighter" style={{ color: sc.accent }}>{progressPercent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden mb-3 shadow-inner">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${progressPercent}%`, backgroundColor: sc.accent }}
                      >
                        <div className="absolute inset-0 bg-white/20" style={{ animation: 'premium-shimmer 2s infinite linear' }}></div>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] text-right">
                      {completedTasks} of {totalTasks} Tasks Completed
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">

        {/* ─── Tasks Section ─── */}
        {application.status !== 'Pending' && application.status !== 'Rejected' && (
          <div data-section="tasks" className="mb-20" style={{ animation: 'premium-slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both 0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-8 flex items-center gap-4">
               <div className="w-2 h-8 rounded-full bg-[#E87C41]"></div>
               Assigned Tasks
            </h2>

            {application.assignedTasks.length === 0 ? (
              <div className="text-center py-20 bg-[#0a0a0a] rounded-[2rem] border border-white/5">
                <AlertCircle className="w-12 h-12 text-[#E87C41]/50 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">No Tasks Assigned Yet</h3>
                <p className="text-sm text-gray-500 font-medium">Check back later when your mentor assigns a new project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {application.assignedTasks.map((t, i) => {
                  const ts = TASK_STATUS[t.status] || TASK_STATUS.Pending;
                  return (
                    <div key={t._id} className="group flex flex-col bg-[#0a0a0a] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(232,124,65,0.15)] overflow-hidden relative" style={{ animation: `premium-slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) both ${0.5 + (i * 0.1)}s` }}>
                      {/* Dynamic left border based on task status */}
                      <div className="absolute top-0 left-0 w-1.5 h-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: ts.accent }}></div>
                      
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex justify-between items-start gap-6 mb-6">
                           <div>
                              <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded flex items-center justify-center bg-white/5 text-white">{i + 1}</span>
                                Task
                              </div>
                              <h4 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                                {t.task?.title}
                              </h4>
                           </div>
                           <span className="shrink-0 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-sm" style={{ backgroundColor: ts.bg, color: ts.accent, border: `1px solid ${ts.border}` }}>
                             {t.status}
                           </span>
                        </div>
                        
                        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl mb-6">
                           <p className="text-sm text-gray-400 leading-relaxed font-medium">
                             {t.task?.details}
                           </p>
                        </div>

                        {t.task?.referalLink && (
                          <a href={t.task.referalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-gray-300 hover:text-white hover:bg-white/10 uppercase tracking-[0.15em] transition-all mb-8 w-fit shadow-sm">
                            <ExternalLink className="w-4 h-4" /> View Resources
                          </a>
                        )}

                        {t.status === 'Pending' && submittingTask !== t.task?._id && (
                          <button onClick={() => setSubmittingTask(t.task?._id)} className="w-full py-4 rounded-xl bg-[#E87C41] text-black hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] mt-auto shadow-[0_10px_20px_rgba(232,124,65,0.2)] hover:-translate-y-1">
                            <Send className="w-4 h-4" /> Submit Assignment
                          </button>
                        )}

                        {submittingTask === t.task?._id && (
                          <form onSubmit={(e) => submitTask(t.task?._id, e)} className="mt-auto flex flex-col gap-4 bg-[#111] p-6 rounded-2xl border border-white/10 shadow-inner animate-fade-in">
                            {[
                              { name:'gitRepo', placeholder:'GitHub Repository URL', icon: GitBranch },
                              { name:'liveLink', placeholder:'Live Demo URL (Optional)', icon: Globe },
                              { name:'documentUrl', placeholder:'Document/Report URL (Optional)', icon: File },
                            ].map(({ name, placeholder, icon: Icon }) => (
                              <div key={name} className="relative">
                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input required={name==='gitRepo'} name={name} placeholder={placeholder} value={submissionForm[name]} onChange={handleSubmissionChange} className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E87C41]/50 focus:bg-white/[0.02] transition-colors shadow-inner" />
                              </div>
                            ))}
                            <div className="flex gap-3 mt-2">
                              <button type="submit" className="flex-[2] py-3.5 bg-[#E87C41] text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md">
                                <Send className="w-4 h-4" /> Final Submit
                              </button>
                              <button type="button" onClick={() => setSubmittingTask(null)} className="flex-1 py-3.5 bg-white/5 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all">
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
          <div data-section="cert" className="mb-20" style={{ animation: 'premium-slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both 0.6s' }}>
            <div className="relative bg-[#0a0a0a] rounded-[2rem] border border-[#E87C41]/20 p-10 md:p-16 text-center overflow-hidden" style={{ animation: 'premium-pulse-glow 4s ease-in-out infinite' }}>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E87C41] to-transparent"></div>
              
              <div className="w-24 h-24 mx-auto rounded-full bg-[#E87C41]/10 border border-[#E87C41]/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(232,124,65,0.2)]" style={{ animation: 'premium-float 6s ease-in-out infinite' }}>
                <Award className="w-12 h-12 text-[#E87C41]" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Congratulations!
              </h2>
              <p className="text-sm md:text-base text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                Your dedication and hard work have paid off. Your internship is officially verified and your certificate is ready to showcase your new skills!
              </p>
              
              <div className="flex justify-center bg-[#050505] p-6 md:p-10 rounded-[2rem] border border-white/5">
                <Certificate userName={application.resume.name} issueDate={new Date().toLocaleDateString()} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyApplication;
