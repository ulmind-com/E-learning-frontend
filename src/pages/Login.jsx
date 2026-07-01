import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import PremiumBg from '../components/PremiumBg';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLoginOrRegister } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const { name, email, sub } = userInfo.data;
        const result = await googleLoginOrRegister(name, email, sub);
        if (result.success) {
          navigate(result.user.role === 'admin' ? '/admin' : '/');
        } else {
          setError(result.message || 'Google login failed.');
        }
      } catch (err) {
        setError('Google authentication failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Login Failed');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <PremiumBg />

      <div className="w-full max-w-md relative animate-scale-in z-10">
        <div className="rounded-[28px] p-8 shadow-[0_20px_40px_rgba(232,124,65,0.15)] glass-panel border border-white/10" style={{ backgroundColor: 'rgba(11,11,12,0.6)', backdropFilter: 'blur(20px)' }}>
          {/* Header */}
          <div className="text-center mb-8 animate-slide-down">
            <div className="inline-flex p-3.5 rounded-2xl mb-5 bg-[#E87C41]/10 border border-[#E87C41]/20 shadow-inner">
              <LogIn className="h-8 w-8 text-[#E87C41]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h1>
            <p className="text-sm mt-2 text-white/60 font-medium">Sign in to access your premium courses</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <label className="block text-[13px] font-semibold tracking-wide mb-2 text-white/80 uppercase">Email Address</label>
              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within/input:text-[#E87C41] transition-colors">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E87C41]/50 transition-all bg-white/5 border border-white/10 text-white placeholder-white/30"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-[13px] font-semibold tracking-wide mb-2 text-white/80 uppercase">Password</label>
              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within/input:text-[#E87C41] transition-colors">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E87C41]/50 transition-all bg-white/5 border border-white/10 text-white placeholder-white/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E87C41] hover:shadow-[0_6px_20px_rgba(232,124,65,0.4)] text-white py-3.5 px-4 rounded-xl font-bold text-[15px] transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 btn-sweep overflow-hidden animate-slide-up group/btn"
              style={{ animationDelay: '0.15s' }}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin relative z-10" /> : (
                <>
                  <span className="relative z-10 tracking-wide">Sign In to Dashboard</span>
                  <LogIn className="h-5 w-5 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 animate-slide-up flex items-center" style={{ animationDelay: '0.2s' }}>
            <div className="flex-grow border-t border-white/10"></div>
            <span className="px-4 text-[13px] text-white/40 font-medium">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            onClick={() => handleGoogleSuccess()}
            disabled={loading}
            className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-800 py-3.5 px-4 rounded-xl font-bold text-[15px] transition-all focus:outline-none flex items-center justify-center gap-3 cursor-pointer disabled:opacity-55 shadow-lg animate-slide-up"
            style={{ animationDelay: '0.25s' }}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>


          <p className="text-center text-sm mt-8 animate-fade-in text-white/60 font-medium" style={{ animationDelay: '0.3s' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#E87C41] hover:text-[#ff9c6a] transition-colors hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
