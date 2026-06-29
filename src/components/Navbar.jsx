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
      className={`relative px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 group ${
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
          <NavLink to="/" label="Courses" isActive={checkActive('/') && !checkActive('/internships')} />
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
            className="p-2 rounded-full transition-colors shadow-sm"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div 
          className="absolute top-20 right-[5%] w-[90%] max-w-sm rounded-3xl overflow-hidden animate-slide-down pointer-events-auto"
          style={{
            backgroundColor: 'var(--navbar-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
          }}
        >
          <div className="flex flex-col p-4 gap-2">
            <Link to="/" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/') && !checkActive('/internships') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/') && !checkActive('/internships') ? 'var(--accent)' : 'var(--text-primary)' }}>
              <BookOpen className="h-5 w-5" /> <span>Courses</span>
            </Link>
            <Link to="/internships" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/internships') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/internships') ? 'var(--accent)' : 'var(--text-primary)' }}>
              <Briefcase className="h-5 w-5" /> <span>Internships</span>
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <Shield className="h-5 w-5" /> <span>Admin</span>
                    </Link>
                    <Link to="/admin/internships-manage" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/admin/internships-manage') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/admin/internships-manage') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <Briefcase className="h-5 w-5" /> <span>Manage Interns</span>
                    </Link>
                    <Link to="/admin/internships" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/admin/internships') && !checkActive('/admin/internships-manage') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/admin/internships') && !checkActive('/admin/internships-manage') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <CheckCircle className="h-5 w-5" /> <span>Intern Apps</span>
                    </Link>
                    <Link to="/admin/tasks" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/admin/tasks') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/admin/tasks') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <LayoutList className="h-5 w-5" /> <span>Tasks</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/my-courses" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/my-courses') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/my-courses') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <User className="h-5 w-5" /> <span>My Courses</span>
                    </Link>
                    <Link to="/my-application" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/my-application') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/my-application') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <FileText className="h-5 w-5" /> <span>Application</span>
                    </Link>
                  </>
                )}
                
                <div className="h-px my-2" style={{ background: `linear-gradient(90deg, transparent, var(--border-color), transparent)` }}></div>
                <button onClick={handleLogout} className="flex items-center space-x-4 p-4 rounded-2xl font-bold w-full text-left transition-colors" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-bg)' }}>
                  <LogOut className="h-5 w-5" /> <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ color: 'var(--text-primary)' }}>
                  <span>Login</span>
                </Link>
                <Link to="/register" onClick={closeMobile} className="flex items-center justify-center space-x-4 p-4 rounded-2xl font-bold text-white transition-all shadow-md" style={{ backgroundColor: 'var(--accent)' }}>
                  <span>Sign Up Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
