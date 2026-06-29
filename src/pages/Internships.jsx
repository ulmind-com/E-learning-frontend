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
      <section className="relative z-10 pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center animate-slide-down">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(232,124,65,0.2)]" style={{ borderColor: 'rgba(232, 124, 65, 0.3)', backgroundColor: 'rgba(232, 124, 65, 0.05)' }}>
            <Zap className="h-4 w-4" style={{ color: '#E87C41' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#E87C41' }}>Premium Programs</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Launch Your Career with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87C41] via-[#ff9a5a] to-[#E87C41] animate-gradient-x">
              Elite Internships
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Work on real-world projects, get mentored by industry experts, and build a portfolio that guarantees you get hired.
          </p>
        </div>
      </section>

      {/* ─── Internship Cards ─── */}
      <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-8 pb-32">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: '#E87C41' }} />
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
              <div 
                key={internship._id}
                className="group relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 hover:border-[#E87C41]/50 transition-all duration-500 hover:-translate-y-4 shadow-2xl"
                style={{ 
                  backgroundColor: 'rgba(15, 15, 15, 0.8)',
                  animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s both`
                }}
              >
                {/* Glowing hover effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E87C41]/0 via-[#E87C41]/0 to-[#E87C41]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Thumbnail */}
                <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-white/10">
                  <img 
                    src={internship.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${internship.thumbnail}` : internship.thumbnail} 
                    alt={internship.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border" style={{ backgroundColor: 'rgba(232,124,65,0.2)', borderColor: 'rgba(232,124,65,0.4)', color: '#E87C41' }}>
                      {internship.internshipType === 'free' ? 'FREE' : 'PREMIUM'}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-[#E87C41] transition-colors duration-300">
                    {internship.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                    {internship.description}
                  </p>

                  {/* Meta Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(232,124,65,0.1)' }}>
                        <Clock className="h-4 w-4" style={{ color: '#E87C41' }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Duration</div>
                        <div className="text-sm font-semibold text-white">{internship.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(232,124,65,0.1)' }}>
                        <Users className="h-4 w-4" style={{ color: '#E87C41' }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Spots</div>
                        <div className="text-sm font-semibold text-white">{internship.maxStudents}</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1">Fee</div>
                      <div className="text-2xl font-black" style={{ color: '#E87C41' }}>
                        {internship.internshipType === 'free' ? 'Free' : `₹${internship.price}`}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/internship/${internship._id}`} 
                      className="group/btn relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-black transition-transform hover:scale-105"
                      style={{ backgroundColor: '#E87C41', boxShadow: '0 0 20px rgba(232,124,65,0.4)' }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Details <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white transform translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Internships;
