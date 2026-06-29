import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Clock, Users, DollarSign, CheckCircle2, ChevronLeft, Loader2, Sparkles, Target, Zap, Briefcase } from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl opacity-5 animate-pulse" style={{ backgroundColor: '#E87C41' }}></div>
          <Loader2 className="h-16 w-16 animate-spin relative z-10" style={{ color: '#E87C41' }} />
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
      
      {/* ─── Parallax Hero Header ─── */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-end pb-16">
        {/* Background Image with Parallax & Extreme Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={internship.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${internship.thumbnail}` : internship.thumbnail} 
            alt={internship.title} 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent"></div>
          <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E87C41]/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full animate-slide-up">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[#E87C41] transition-colors mb-8 group w-fit">
            <div className="p-2 rounded-full border border-gray-700 group-hover:border-[#E87C41] bg-black/50 backdrop-blur-md transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </div>
            <span className="font-medium tracking-wide uppercase text-xs">Back to Listings</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41]/10 text-[#E87C41] border border-[#E87C41]/30 backdrop-blur-md shadow-[0_0_20px_rgba(232,124,65,0.2)]">
              {internship.internshipType === 'free' ? 'Free Program' : 'Premium Program'}
            </span>
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.1em] bg-white text-black">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Admissions Open
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
            {internship.title}
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed font-light">
            {internship.description}
          </p>
        </div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#E87C41]/30 transition-colors group">
                <Clock className="h-8 w-8 text-[#E87C41] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Duration</div>
                <div className="text-xl font-black">{internship.duration}</div>
              </div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#E87C41]/30 transition-colors group">
                <Users className="h-8 w-8 text-[#E87C41] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Seats</div>
                <div className="text-xl font-black">{internship.maxStudents}</div>
              </div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#E87C41]/30 transition-colors group">
                <DollarSign className="h-8 w-8 text-[#E87C41] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Stipend/Fee</div>
                <div className="text-xl font-black">{internship.internshipType === 'free' ? 'Free' : `₹${internship.price}`}</div>
              </div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#E87C41]/30 transition-colors group">
                <Target className="h-8 w-8 text-[#E87C41] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Format</div>
                <div className="text-xl font-black">Remote</div>
              </div>
            </div>

            {/* Requirements Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Zap className="h-6 w-6 text-[#E87C41]" />
                <h2 className="text-3xl font-black tracking-tight">Prerequisites</h2>
              </div>
              
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E87C41] opacity-[0.01] blur-3xl rounded-full"></div>
                <ul className="space-y-4">
                  {internship.necessaryThings.split(',').map((req, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="mt-1 bg-[#E87C41]/20 p-1 rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-[#E87C41]" />
                      </div>
                      <span className="text-lg text-gray-300 font-medium leading-relaxed">{req.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column (Sticky Apply Card) */}
          <div className="relative">
            <div className="sticky top-24 bg-[#111] border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E87C41] to-[#ff9a5a] rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition duration-1000"></div>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Enrollment Fee</div>
                  <div className="text-5xl font-black text-[#E87C41] tracking-tighter">
                    {internship.internshipType === 'free' ? 'Free' : `₹${internship.price}`}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-gray-400">Application Status</span>
                    <span className="font-bold text-green-400">Accepting</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-gray-400">Available Seats</span>
                    <span className="font-bold text-white">{internship.maxStudents} left</span>
                  </div>
                </div>

                <Link 
                  to={`/apply-internship/${internship._id}`}
                  className="relative w-full flex items-center justify-center gap-2 py-5 rounded-2xl bg-[#E87C41] text-black font-black text-lg uppercase tracking-wider overflow-hidden group/btn shadow-[0_0_30px_rgba(232,124,65,0.3)] hover:shadow-[0_0_50px_rgba(232,124,65,0.5)] transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Apply Now <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                  </span>
                  {/* Glare effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                </Link>

                <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                  Applying is free. Selection is based on profile screening.
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
