import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, BookOpen, Shield, LayoutList, CheckCircle, Briefcase, FileText, User, BrainCircuit, Settings as SettingsIcon, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

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
    <div className="fixed top-0 z-[100] w-full flex justify-center h-[72px] pointer-events-none transition-all duration-700">
      <nav
        className={`absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center justify-between transition-all duration-[1200ms] ease-in-out overflow-visible ${
          scrolled 
            ? 'top-4 py-2 px-6 rounded-full w-max max-w-[900px] gap-6' 
            : 'top-6 py-4 px-8 rounded-full w-[95%] max-w-[1200px] gap-10'
        }`}
        style={{
          background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, rgba(232,124,65,0.8), rgba(255,50,50,0.5), rgba(50,255,100,0.5)) border-box',
          border: '1.5px solid transparent',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.8)' : '0 20px 50px rgba(232,124,65,0.15)',
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
            ) : null
          ) : null}
        </div>

        {/* Desktop Actions */}
        <div className={`hidden lg:flex items-center space-x-3 pr-2 transition-all duration-500 ${scrolled ? '' : 'mr-4'} relative`}>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E87C41] shadow-lg flex items-center justify-center bg-[#1a1a1a] group-hover:scale-105 transition-transform">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-[#E87C41] text-lg">{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <>
                <div className={`fixed inset-0 z-40 transition-opacity duration-1000 ${profileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setProfileOpen(false)}></div>
                <div className={`absolute right-0 mt-4 w-64 rounded-2xl overflow-hidden shadow-2xl z-50 origin-top-right border border-white/10 transition-all duration-1000 ${profileOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}
                     style={{ backgroundColor: '#111', boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(232, 124, 65, 0.15)' }}>
                    <div className="p-4 border-b border-white/5 bg-white/5 flex flex-col gap-0.5">
                      <p className="font-bold text-white truncate text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      {user.role === 'student' && (
                        <>
                          <Link to="/my-courses" onClick={() => setProfileOpen(false)} className="flex items-center space-x-3 p-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <User className="h-4 w-4" /> <span>My Courses</span>
                          </Link>
                          <Link to="/my-application" onClick={() => setProfileOpen(false)} className="flex items-center space-x-3 p-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <FileText className="h-4 w-4" /> <span>Application</span>
                          </Link>
                        </>
                      )}
                      <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center space-x-3 p-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <SettingsIcon className="h-4 w-4" /> <span>Settings</span>
                      </Link>
                    </div>
                  </div>
              </>
            </div>
          ) : (
            <Link
              to="/login"
              className={`btn-sweep rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 ${scrolled ? 'px-6 py-2 text-sm shadow-md' : 'px-6 py-2.5 text-[13px] shadow-md'}`}
            >
              <span className="relative z-10">Sign In</span>
            </Link>
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
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-[20px] mb-2 border border-white/5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E87C41] flex items-center justify-center bg-[#1a1a1a]">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-[#E87C41]">{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-sm truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

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
              
              <Link to="/settings" onClick={closeMobile} className={`flex items-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 ${checkActive('/settings') ? 'bg-[#E87C41] text-black shadow-lg shadow-[#E87C41]/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                <SettingsIcon className="h-[18px] w-[18px]" /> <span>Settings</span>
              </Link>
              
            </>
          ) : (
            <>
              <div className="h-px w-full bg-white/5 my-1"></div>
              <Link to="/login" onClick={closeMobile} className="flex items-center justify-center space-x-3 p-3.5 rounded-[24px] font-bold text-[14px] transition-all duration-300 bg-[#E87C41] text-black shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
