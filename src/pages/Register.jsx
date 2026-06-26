import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import PremiumBg from '../components/PremiumBg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
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
              <UserPlus className="h-8 w-8 text-[#E87C41]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">Create Account</h1>
            <p className="text-sm mt-2 text-white/60 font-medium">Join our premium learning platform</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <label className="block text-[13px] font-semibold tracking-wide mb-2 text-white/80 uppercase">Full Name</label>
              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within/input:text-[#E87C41] transition-colors">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E87C41]/50 transition-all bg-white/5 border border-white/10 text-white placeholder-white/30"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
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

            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <label className="block text-[13px] font-semibold tracking-wide mb-2 text-white/80 uppercase">Password</label>
              <div className="relative group/input">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within/input:text-[#E87C41] transition-colors">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
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
              style={{ animationDelay: '0.2s' }}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin relative z-10" /> : (
                <>
                  <span className="relative z-10 tracking-wide">Create Account</span>
                  <UserPlus className="h-5 w-5 relative z-10 transition-transform group-hover/btn:scale-110" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8 animate-fade-in text-white/60 font-medium" style={{ animationDelay: '0.25s' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#E87C41] hover:text-[#ff9c6a] transition-colors hover:underline">
              Sign In now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
