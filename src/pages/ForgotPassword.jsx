import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, KeyRound, Lock, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage({ type: 'success', text: 'OTP sent to your email!' });
      setStep(2);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      setMessage({ type: 'success', text: 'OTP verified! Please set a new password.' });
      setStep(3);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or expired OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword });
      setMessage({ type: 'success', text: 'Password reset successfully!' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: '#050505' }}>
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E87C41] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        
        <Link to="/login" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#E87C41]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E87C41]/20 shadow-[0_0_30px_rgba(232,124,65,0.15)]">
              {step === 1 && <KeyRound className="w-8 h-8 text-[#E87C41]" />}
              {step === 2 && <Lock className="w-8 h-8 text-[#E87C41]" />}
              {step === 3 && <CheckCircle2 className="w-8 h-8 text-[#E87C41]" />}
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Enter OTP'}
              {step === 3 && 'New Password'}
            </h2>
            <p className="text-gray-400 text-sm">
              {step === 1 && "Enter your email and we'll send you an OTP to reset your password."}
              {step === 2 && `We've sent a 6-digit OTP to ${email}. Please enter it below.`}
              {step === 3 && 'Your OTP is verified. Please create a new secure password.'}
            </p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
              message.type === 'success' 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white bg-[#1a1a1a] border border-white/5 focus:border-[#E87C41] focus:ring-1 focus:ring-[#E87C41] outline-none transition-all placeholder-gray-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-white font-bold bg-[#E87C41] hover:bg-[#d66a30] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(232,124,65,0.3)] hover:shadow-[0_6px_20px_rgba(232,124,65,0.4)] hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <><span>Send OTP</span><ArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">6-Digit OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3.5 rounded-xl text-white bg-[#1a1a1a] border border-white/5 focus:border-[#E87C41] focus:ring-1 focus:ring-[#E87C41] outline-none transition-all placeholder-gray-600 text-center text-2xl font-mono tracking-[0.5em]"
                    placeholder="------"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-white font-bold bg-[#E87C41] hover:bg-[#d66a30] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(232,124,65,0.3)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify OTP</span>}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Didn't receive the code?{' '}
                <button type="button" onClick={handleSendOtp} className="text-[#E87C41] hover:underline focus:outline-none font-medium">
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white bg-[#1a1a1a] border border-white/5 focus:border-[#E87C41] focus:ring-1 focus:ring-[#E87C41] outline-none transition-all placeholder-gray-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white bg-[#1a1a1a] border border-white/5 focus:border-[#E87C41] focus:ring-1 focus:ring-[#E87C41] outline-none transition-all placeholder-gray-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-white font-bold bg-[#E87C41] hover:bg-[#d66a30] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(232,124,65,0.3)] hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <><span>Reset Password</span><CheckCircle2 className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
