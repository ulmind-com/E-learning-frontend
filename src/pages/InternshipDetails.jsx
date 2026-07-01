import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Clock, Users, DollarSign, CheckCircle2, ChevronLeft, Loader2, Sparkles, Target, Zap, Briefcase } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-1-r539.onrender.com/api';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internship/list/${id}`);
        setInternship(data);
      } catch (err) {
        console.error('Failed to fetch internship details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 px-6 flex justify-center">
         <div className="max-w-7xl w-full">
            <div className="h-10 w-32 bg-white/5 rounded-full mb-8 animate-pulse"></div>
            <div className="h-20 w-3/4 max-w-3xl bg-white/10 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-6 w-1/2 max-w-xl bg-white/5 rounded-lg animate-pulse mb-20"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8 space-y-8">
                  <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
                  <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
               </div>
               <div className="lg:col-span-4 h-96 bg-white/5 rounded-2xl animate-pulse"></div>
            </div>
         </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Briefcase className="h-20 w-20 mb-6 opacity-30" style={{ color: '#E87C41' }} />
        <h2 className="text-3xl font-bold mb-4">Internship Not Found</h2>
        <button onClick={() => navigate('/internships')} className="px-6 py-3 rounded-full font-bold bg-[#E87C41] text-black hover:scale-105 transition-transform">
          Browse Internships
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E87C41] selection:text-black font-sans pb-24">
      
      {/* ─── Ultra-Compact Premium Header ─── */}
      <div className="relative pt-6 pb-8 w-full border-b border-white/5 bg-[#050505]">
        {/* Subtle right-side glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[100%] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 0%, #E87C41 0%, transparent 60%)' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#E87C41] transition-colors mb-4 group">
            <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-[0.15em] uppercase text-[9px]">Back to Listings</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded bg-[#E87C41]/10 border border-[#E87C41]/20 text-[#E87C41] text-[9px] font-black uppercase tracking-[0.2em]">
                  {internship.internshipType === 'free' ? 'Free Program' : 'Premium Program'}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-black text-[9px] font-black uppercase tracking-[0.1em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E87C41] animate-pulse"></span> Enrollment Open
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] mb-3">
                {internship.title}
              </h1>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                {internship.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Formal Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: 'Duration', value: internship.duration },
                { icon: Users, label: 'Positions', value: internship.maxStudents },
                { icon: DollarSign, label: 'Fee', value: internship.internshipType === 'free' ? 'Zero Cost' : `₹${internship.price}` },
                { icon: Target, label: 'Format', value: 'Remote / Online' }
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#E87C41]/40 hover:shadow-[0_10px_30px_rgba(232,124,65,0.05)] group">
                  <div className="p-3 bg-black rounded-xl border border-white/5 mb-4 group-hover:border-[#E87C41]/30 transition-colors">
                    <stat.icon className="h-6 w-6 text-[#E87C41]" />
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-[0.15em] mb-1.5">{stat.label}</div>
                  <div className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Structured Requirements */}
            <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                <div className="p-2 bg-[#E87C41]/10 rounded-lg">
                  <Zap className="h-5 w-5 text-[#E87C41]" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Candidate Requirements</h2>
              </div>
              
              <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E87C41] opacity-[0.02] blur-3xl rounded-full group-hover:opacity-[0.04] transition-opacity duration-500"></div>
                <ul className="space-y-6 relative z-10">
                  {internship.necessaryThings.split(',').map((req, index) => (
                    <li key={index} className="flex items-start gap-5">
                      <div className="mt-1 bg-black border border-[#E87C41]/30 p-1.5 rounded-full shadow-[0_0_10px_rgba(232,124,65,0.1)]">
                        <CheckCircle2 className="h-4 w-4 text-[#E87C41]" />
                      </div>
                      <span className="text-base text-gray-400 font-medium leading-relaxed">{req.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column (Formal Application Card) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 bg-[#050505] border border-white/10 rounded-[24px] p-1 shadow-2xl overflow-hidden group">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#E87C41]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
              
              <div className="relative bg-[#0a0a0a] rounded-[22px] p-8 h-full border border-white/5">
                <div className="text-center mb-10">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Processing Fee</div>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter">
                    {internship.internshipType === 'free' ? 'Free' : `₹${internship.price}`}
                  </div>
                </div>

                <div className="space-y-5 mb-10 bg-black p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
                    <span className="text-xs font-bold text-[#E87C41] uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#E87C41] animate-pulse"></span> Accepting
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Capacity</span>
                    <span className="text-sm font-bold text-white">{internship.maxStudents} Slots</span>
                  </div>
                </div>

                <Link 
                  to={`/apply-internship/${internship._id}`}
                  className="relative w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#E87C41] text-black font-black text-sm uppercase tracking-[0.1em] overflow-hidden group/btn hover:scale-[1.02] transition-transform duration-300 shadow-[0_10px_20px_rgba(232,124,65,0.2)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Submit Application <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <p className="text-center text-[11px] text-gray-600 mt-6 font-semibold uppercase tracking-wider leading-relaxed">
                  Strictly merit-based selection. <br/> Profile screening applies.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default InternshipDetails;
