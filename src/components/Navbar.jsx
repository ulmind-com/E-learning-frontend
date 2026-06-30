import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, BookOpen, Shield, LayoutList, CheckCircle, Briefcase, FileText, User, BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const checkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ to, label, isActive }) => (
    <Link
      to={to}
      className={`relative px-3 lg:px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-300 group ${
        scrolled ? '' : ''
      }`}
      style={{ color: isActive ? '#ffffff' : '#a1a1aa' }}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{label}</span>
      {isActive && (
        <span 
          className="absolute inset-0 rounded-full -z-10 transition-all duration-300"
          style={{ backgroundColor: 'rgba(232, 124, 65, 0.15)' }}
        ></span>
      )}
      {!isActive && (
        <span 
          className="absolute inset-0 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
          style={{ backgroundColor: 'rgba(232, 124, 65, 0.08)' }}
        ></span>
      )}
    </Link>
  );

  return (
    <div className="sticky top-0 z-[100] w-full flex justify-center h-[72px] pointer-events-none transition-all duration-700">
      <nav
        className={`absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
          scrolled 
            ? 'top-4 p-2 rounded-full w-max max-w-[1000px] gap-8 translate-y-0' 
            : 'top-0 px-6 py-4 w-full max-w-full gap-4 translate-y-0 border-b'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 15, 5, 0.95) 0%, rgba(5, 5, 5, 0.95) 100%)',
          borderBottom: !scrolled ? '1px solid rgba(232, 124, 65, 0.2)' : '1px solid rgba(232, 124, 65, 0.2)',
          borderTop: scrolled ? '1px solid rgba(232, 124, 65, 0.2)' : 'none',
          borderLeft: scrolled ? '1px solid rgba(232, 124, 65, 0.2)' : 'none',
          borderRight: scrolled ? '1px solid rgba(232, 124, 65, 0.2)' : 'none',
          boxShadow: scrolled ? '0 10px 40px rgba(232, 124, 65, 0.15)' : 'none',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-1.5 rounded-full group transition-all duration-500 ${scrolled ? '' : 'scale-105 ml-4'}`}
        >
          <BrainCircuit className={`h-7 w-7 transition-transform duration-700 group-hover:scale-110 text-white`} />
          <span className={`font-extrabold tracking-tight hidden sm:block transition-all duration-500 text-white ${scrolled ? 'text-lg' : 'text-xl'}`}>
            SkillStream
          </span>
        </Link>

        {/* Desktop Links */}
        <div 
          className={`hidden lg:flex items-center p-1 transition-all duration-500 rounded-full`} 
          style={{ backgroundColor: 'transparent' }}
        >
          <NavLink to="/" label="Home" isActive={checkActive('/')} />
          <NavLink to="/courses" label="Courses" isActive={checkActive('/courses')} />
          <NavLink to="/internships" label="Internships" isActive={checkActive('/internships')} />

          {user ? (
            user.role === 'admin' ? (
              <>
                <NavLink to="/admin" label="Admin" isActive={checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks')} />
                <NavLink to="/admin/internships-manage" label="Manage Interns" isActive={checkActive('/admin/internships-manage')} />
                <NavLink to="/admin/internships" label="Intern Apps" isActive={checkActive('/admin/internships') && !checkActive('/admin/internships-manage')} />
                <NavLink to="/admin/tasks" label="Tasks" isActive={checkActive('/admin/tasks')} />
              </>
            ) : (
              <>
                <NavLink to="/my-courses" label="My Courses" isActive={checkActive('/my-courses')} />
                <NavLink to="/my-application" label="My App" isActive={checkActive('/my-application')} />
              </>
            )
          ) : null}
        </div>

        {/* Desktop Actions */}
        <div className={`hidden lg:flex items-center space-x-3 pr-2 transition-all duration-500 ${scrolled ? '' : 'mr-4'}`}>
          {user ? (
            <button
              onClick={handleLogout}
              className={`btn-sweep flex items-center rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 ${scrolled ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-[13px]'}`}
            >
              <div className="relative z-10 flex items-center space-x-2">
                <span>Logout</span>
                <LogOut className="h-4 w-4" />
              </div>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-full font-bold transition-all duration-300 group relative ${scrolled ? 'px-5 py-2 text-sm text-white hover:bg-white/5' : 'px-6 py-2.5 text-[13px] text-white hover:text-gray-300'}`}
              >
                <span className="relative z-10">Login</span>
              </Link>
              <Link
                to="/register"
                className={`btn-sweep rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 ${scrolled ? 'px-6 py-2 text-sm shadow-md' : 'px-6 py-2.5 text-[13px] shadow-md'}`}
              >
                <span className="relative z-10">Sign In</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center pr-2 space-x-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-full transition-all duration-500 flex items-center justify-center text-white hover:bg-white/10 ${mobileOpen ? 'rotate-90' : 'rotate-0'}`}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`absolute top-[80px] right-4 sm:right-6 w-[260px] rounded-[32px] overflow-hidden border border-white/10 transition-all duration-500 origin-top-right ${
          mobileOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-90 opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          backgroundColor: '#0a0a0a',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(232, 124, 65, 0.15)'
        }}
      >
        <div className="flex flex-col p-3 gap-1.5 relative">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E87C41] opacity-5 blur-[50px] rounded-full pointer-events-none"></div>

          <Link to="/" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <BookOpen className="h-[18px] w-[18px]" /> <span>Home</span>
          </Link>
          <Link to="/courses" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/courses') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <BookOpen className="h-[18px] w-[18px]" /> <span>Courses</span>
          </Link>
          <Link to="/internships" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/internships') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <Briefcase className="h-[18px] w-[18px]" /> <span>Internships</span>
          </Link>

          {user ? (
            <>
              <div className="h-px w-full bg-white/5 my-1"></div>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <Shield className="h-[18px] w-[18px]" /> <span>Admin</span>
                  </Link>
                  <Link to="/admin/internships-manage" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/admin/internships-manage') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <Briefcase className="h-[18px] w-[18px]" /> <span>Manage Interns</span>
                  </Link>
                  <Link to="/admin/internships" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/admin/internships') && !checkActive('/admin/internships-manage') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <CheckCircle className="h-[18px] w-[18px]" /> <span>Intern Apps</span>
                  </Link>
                  <Link to="/admin/tasks" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/admin/tasks') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <LayoutList className="h-[18px] w-[18px]" /> <span>Tasks</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/my-courses" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/my-courses') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <User className="h-[18px] w-[18px]" /> <span>My Courses</span>
                  </Link>
                  <Link to="/my-application" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/my-application') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <FileText className="h-[18px] w-[18px]" /> <span>Application</span>
                  </Link>
                </>
              )}
              
              <div className="h-px w-full bg-white/5 my-1"></div>
              <button onClick={handleLogout} className="flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] w-full text-left transition-all duration-300 text-red-500 hover:bg-red-500/10">
                <LogOut className="h-[18px] w-[18px]" /> <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="h-px w-full bg-white/5 my-1"></div>
              <Link to="/login" onClick={closeMobile} className="flex items-center justify-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 text-white hover:bg-white/5">
                <span>Login</span>
              </Link>
              <Link to="/register" onClick={closeMobile} className="flex items-center justify-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 bg-[#E87C41] text-black shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <span>Sign Up Free</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
