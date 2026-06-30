import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, ArrowRight, Clock, Users, DollarSign, Loader2, Sparkles, Zap, Star } from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internship/list`);
        setInternships(data);
      } catch (err) {
        console.error('Failed to fetch internships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden relative" >
      {/* ─── Extreme Animated Background ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.02] blur-[150px] animate-pulse-glow" style={{ backgroundColor: '#E87C41' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.01] blur-[150px] animate-pulse-glow" style={{ backgroundColor: '#ff5e00', animationDelay: '2s' }}></div>
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ 
          backgroundImage: 'linear-gradient(#E87C41 1px, transparent 1px), linear-gradient(90deg, #E87C41 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-100px)',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 pt-12 pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center animate-slide-down">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl shadow-[0_0_15px_rgba(232,124,65,0.2)]" style={{ borderColor: 'rgba(232, 124, 65, 0.3)', backgroundColor: 'rgba(232, 124, 65, 0.05)' }}>
            <Zap className="h-3 w-3" style={{ color: '#E87C41' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#E87C41' }}>Premium Programs</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter leading-[1.1] drop-shadow-2xl">
            Launch Your Career with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87C41] via-[#ff9a5a] to-[#E87C41] animate-gradient-x relative inline-block">
              Elite Internships
              <div className="absolute -bottom-2 left-0 w-full h-1 rounded-full bg-gradient-to-r from-transparent via-[#E87C41] to-transparent opacity-50 blur-[2px]"></div>
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Work on real-world projects, get mentored by industry experts, and build a portfolio that guarantees you get hired.
          </p>
        </div>
      </section>

      {/* ─── Internship Cards ─── */}
      <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-8 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative flex flex-col p-5 rounded-[16px] border border-white/5 bg-[#0a0a0a]" style={{ minHeight: '400px', animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.1}s` }}>
                <div className="flex gap-1.5 mb-4 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                </div>
                <div className="w-full aspect-[16/9] rounded-xl bg-white/5 mb-5 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full" style={{ animation: 'shimmer 2s infinite' }}></div>
                </div>
                <div className="flex flex-col px-1 flex-grow">
                   <div className="flex gap-2 mb-5">
                      <div className="h-5 w-16 bg-white/5 rounded-full"></div>
                      <div className="h-5 w-24 bg-white/5 rounded-full"></div>
                   </div>
                   <div className="h-6 w-3/4 bg-white/10 rounded mb-3"></div>
                   <div className="h-6 w-1/2 bg-white/5 rounded mb-auto"></div>
                   
                   <div className="flex justify-between items-end mt-6 mb-5">
                      <div className="h-8 w-20 bg-white/10 rounded"></div>
                      <div className="h-6 w-24 bg-white/5 rounded"></div>
                   </div>
                   <div className="h-10 w-32 bg-white/10 rounded-full mt-1"></div>
                </div>
              </div>
            ))}
          </div>

        ) : internships.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] rounded-3xl border border-white/5 backdrop-blur-sm">
            <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: '#E87C41' }} />
            <h3 className="text-2xl font-bold text-white mb-2">No Internships Available</h3>
            <p className="text-gray-400">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((internship, index) => (
              <Link
                to={`/internship/${internship._id}`}
                key={internship._id}
                className="relative flex flex-col p-5 rounded-[16px] transition-all duration-500 hover:-translate-y-2 group no-underline"
                style={{
                  background: 'linear-gradient(180deg, rgba(30, 20, 15, 0.6) 0%, #050505 100%)',
                  border: '1px solid rgba(232, 124, 65, 0.15)',
                  animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s both`
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
                  <img
                    src={internship.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${internship.thumbnail}` : internship.thumbnail}
                    alt={internship.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
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
                    <span className="text-[10px] px-3 py-1 rounded-full text-gray-300 border border-white/10 bg-transparent tracking-wide uppercase">
                      {internship.internshipType === 'free' ? 'FREE' : 'PREMIUM'}
                    </span>
                    <span className="text-[10px] px-3 py-1 rounded-full text-gray-300 border border-white/10 bg-transparent tracking-wide flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5"/> {internship.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[20px] font-semibold mb-6 line-clamp-2 leading-[1.3] text-white tracking-wide group-hover:text-[#E87C41] transition-colors duration-300"
                  >
                    {internship.title}
                  </h3>
                  
                  <div className="mt-auto">
                    {/* Price & Action */}
                    <div className="flex items-end justify-between mb-5">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                           <span className="text-white text-[16px] font-medium">Fee</span>
                           <span className="text-[20px] font-medium tracking-tight" style={{ color: '#E87C41' }}>
                             {internship.internshipType === 'free' ? 'Free' : `Rs.${internship.price}`}
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-300 font-medium">{internship.maxStudents} Spots</span>
                      </div>
                    </div>

                    <div className="pt-1 pb-1">
                      <button className="btn-sweep w-max flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[12px] font-bold transition-all duration-300">
                         <span className="relative z-10 flex items-center gap-2">
                           Check Details <ArrowRight className="w-3.5 h-3.5" />
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

export default Internships;
