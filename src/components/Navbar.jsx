import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Menu, X, BookOpen, Shield, LayoutList, CheckCircle, Briefcase, FileText, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 group ${
        scrolled ? '' : 'text-base'
      }`}
      style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
    >
      <span className="relative z-10 group-hover:text-[var(--text-primary)] transition-colors duration-300">{label}</span>
      {isActive && (
        <span 
          className="absolute inset-0 rounded-full -z-10 transition-all duration-500"
          style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent)', opacity: 0.5 }}
        ></span>
      )}
      {!isActive && (
        <span 
          className="absolute inset-0 rounded-full -z-10 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out"
          style={{ backgroundColor: 'var(--bg-input)' }}
        ></span>
      )}
    </Link>
  );

  return (
    <div className="sticky top-0 z-[100] w-full flex justify-center h-[72px] pointer-events-none transition-all duration-700">
      <nav
        className={`absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center justify-between transition-all duration-700 ease-in-out overflow-hidden ${
          scrolled 
            ? 'top-4 p-2 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.3)] w-max max-w-[1000px] border gap-8 translate-y-2' 
            : 'top-0 px-6 py-4 rounded-none shadow-sm w-full max-w-full border-b gap-4 translate-y-0'
        }`}
        style={{
          backgroundColor: 'var(--navbar-bg)',
          borderColor: 'var(--border-color)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-1.5 rounded-full group transition-all duration-1000 ${scrolled ? '' : 'scale-110 ml-4'}`}
        >
          <div className="flex items-center justify-center p-2 rounded-full text-white bg-gradient-to-br from-[var(--accent)] to-[#047857] shadow-lg shadow-[var(--accent-glow)] group-hover:rotate-[360deg] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className={`font-extrabold tracking-tight hidden sm:block transition-all duration-1000 ${scrolled ? 'text-lg' : 'text-xl'}`} style={{ color: 'var(--text-primary)' }}>
            SkillStream
          </span>
        </Link>

        {/* Desktop Links */}
        <div className={`hidden lg:flex items-center p-1 rounded-full backdrop-blur-md transition-all duration-1000`} style={{ backgroundColor: scrolled ? 'var(--bg-input)' : 'transparent' }}>
          <NavLink to="/" label="Courses" isActive={checkActive('/')} />

          {user ? (
            user.role === 'admin' ? (
              <>
                <NavLink to="/admin" label="Admin" isActive={checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks')} />
                <NavLink to="/admin/internships" label="Internships" isActive={checkActive('/admin/internships')} />
                <NavLink to="/admin/tasks" label="Tasks" isActive={checkActive('/admin/tasks')} />
              </>
            ) : (
              <>
                <NavLink to="/my-courses" label="My Courses" isActive={checkActive('/my-courses')} />
                <NavLink to="/apply-internship" label="Apply" isActive={checkActive('/apply-internship')} />
                <NavLink to="/my-application" label="Application" isActive={checkActive('/my-application')} />
              </>
            )
          ) : null}
        </div>

        {/* Desktop Actions */}
        <div className={`hidden lg:flex items-center space-x-3 pr-2 transition-all duration-1000 ${scrolled ? '' : 'mr-4'}`}>
          <button
            onClick={toggleTheme}
            className={`rounded-full transition-all duration-300 group relative ${scrolled ? 'p-2.5' : 'p-3 scale-110'}`}
            style={{ color: 'var(--text-secondary)' }}
            title="Toggle Theme"
          >
            <span 
              className="absolute inset-0 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out -z-10"
              style={{ backgroundColor: 'var(--bg-input)' }}
            ></span>
            <div className="group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out">
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-500" />}
            </div>
          </button>

          <div className="w-px h-6 mx-2" style={{ backgroundColor: 'var(--border-color)' }}></div>

          {user ? (
            <button
              onClick={handleLogout}
              className={`group flex items-center space-x-2 rounded-full font-bold text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 ${scrolled ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-base shadow-lg'}`}
              style={{ backgroundColor: 'var(--danger)', boxShadow: '0 8px 20px var(--danger-bg)' }}
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-full font-bold transition-all duration-300 group relative ${scrolled ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base'}`}
                style={{ color: 'var(--text-primary)' }}
              >
                <span 
                  className="absolute inset-0 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out -z-10"
                  style={{ backgroundColor: 'var(--bg-input)' }}
                ></span>
                <span className="relative z-10">Login</span>
              </Link>
              <Link
                to="/register"
                className={`rounded-full font-bold text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 shadow-lg ${scrolled ? 'px-6 py-2.5 text-sm' : 'px-8 py-3 text-base scale-105'}`}
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 20px var(--accent-glow-strong)' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center pr-2 space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-blue-500" />}
          </button>
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
            <Link to="/" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/') ? 'var(--accent)' : 'var(--text-primary)' }}>
              <BookOpen className="h-5 w-5" /> <span>Courses</span>
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/admin') && !checkActive('/admin/internships') && !checkActive('/admin/tasks') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <Shield className="h-5 w-5" /> <span>Admin</span>
                    </Link>
                    <Link to="/admin/internships" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/admin/internships') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/admin/internships') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <CheckCircle className="h-5 w-5" /> <span>Internships</span>
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
                    <Link to="/apply-internship" onClick={closeMobile} className="flex items-center space-x-4 p-4 rounded-2xl font-bold transition-all" style={{ backgroundColor: checkActive('/apply-internship') ? 'var(--accent-glow)' : 'transparent', color: checkActive('/apply-internship') ? 'var(--accent)' : 'var(--text-primary)' }}>
                      <Briefcase className="h-5 w-5" /> <span>Apply</span>
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
