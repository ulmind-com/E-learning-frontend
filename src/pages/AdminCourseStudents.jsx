import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ArrowLeft, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PremiumBg from '../components/PremiumBg';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api'; // Or use env var if available

const AdminCourseStudents = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Course Details to get the title
        const courseRes = await axios.get(`${API_URL}/courses/${courseId}`);
        setCourse(courseRes.data);

        // Fetch Enrolled Students
        const studentsRes = await axios.get(`${API_URL}/courses/admin/${courseId}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(studentsRes.data);
      } catch (err) {
        console.error("Error fetching students data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [courseId, token]);

  return (
    <div className="min-h-screen relative text-white" >
      <PremiumBg />
      
      {/* Orange edge glows */}
      <div className="fixed top-0 left-0 w-[150px] md:w-[300px] h-full bg-gradient-to-r from-[#E87C41]/10 to-transparent pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[150px] md:w-[300px] h-full bg-gradient-to-l from-[#E87C41]/10 to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => {
              navigate('/admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div className="p-3 rounded-2xl bg-[#E87C41]/10 border border-[#E87C41]/20 shadow-inner">
            <Users className="h-7 w-7 text-[#E87C41]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Enrolled Students
            </h1>
            {course && (
              <p className="text-[15px] font-medium text-white/50 mt-1">
                Course: <span className="text-[#E87C41]">{course.title}</span>
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {!loading && (
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between mb-8 shadow-sm">
            <span className="text-white/70 font-semibold uppercase tracking-wider text-[14px]">Total Students Enrolled</span>
            <span className="text-3xl font-bold text-white">{students.length}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-5 pb-10">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="glass-panel p-5 rounded-[24px] flex items-center justify-between border border-white/5" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out ${i * 0.1}s` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10"></div>
                    <div className="w-48 h-5 rounded bg-white/10"></div>
                  </div>
                  <div className="w-40 h-8 rounded-full bg-white/5"></div>
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center bg-white/5 rounded-[24px] border border-white/5 h-[400px]">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-white/30" />
              </div>
              <p className="text-2xl font-bold text-white/80">No students found</p>
              <p className="text-[15px] text-white/40 mt-3">There are currently no students enrolled in this course.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {students.map((student, index) => (
                <div key={student._id} className="p-6 rounded-[24px] flex items-center justify-between transition-all hover:-translate-y-1 hover:bg-white/10 bg-white/5 border border-white/10 group shadow-sm">
                  <div className="flex items-center space-x-5 flex-1">
                    {/* Premium Numbering Badge */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[13px] font-bold text-white/50 group-hover:bg-[#E87C41]/20 group-hover:text-[#E87C41] group-hover:border-[#E87C41]/40 transition-all shadow-inner">
                      {index + 1}
                    </div>
                    
                    {/* Human Icon Avatar */}
                    <div className="h-14 w-14 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(232,124,65,0.4)] group-hover:shadow-[0_0_25px_rgba(232,124,65,0.6)] transition-shadow" style={{ background: 'linear-gradient(135deg, #E87C41, #ff9c6a)' }}>
                      <User className="h-6 w-6 text-white drop-shadow-md" strokeWidth={2.5} />
                    </div>
                    
                    <div className="flex-1 ml-2">
                      <h4 className="font-bold text-[18px] text-white tracking-wide">{student.name}</h4>
                      <p className="text-[14px] text-white/50 font-medium mt-0.5">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex-1 max-w-[280px] ml-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-[14px] mb-3 font-semibold">
                      <span className="text-white/60 uppercase tracking-wide">Course Progress</span>
                      <span className={`${student.progressPercentage === 100 ? 'text-[#22c55e]' : 'text-[#E87C41]'}`}>{student.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden bg-white/10">
                      <div 
                        className="h-full transition-all duration-1000 ease-out relative"
                        style={{ 
                          width: `${student.progressPercentage}%`, 
                          backgroundColor: student.progressPercentage === 100 ? '#22c55e' : '#E87C41',
                          boxShadow: student.progressPercentage === 100 ? '0 0 10px rgba(34,197,94,0.6)' : '0 0 10px rgba(232,124,65,0.6)'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseStudents;
