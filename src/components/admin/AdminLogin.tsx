import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigate, isAdminLoggedIn } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdminLoggedIn) {
    navigate('admin-dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(email, password);
    if (success) {
      navigate('admin-dashboard');
    } else {
      setError('Invalid credentials.');
    }
  };


  return (
    <div className="bg-[#F7F4EF] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E3DDD3] shadow-xl p-8 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-luxury-gradient text-white mx-auto flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-xs uppercase tracking-widest text-[#8B5CF6] font-semibold">
            CATZONE PORTAL
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#191816]">
            Staff & Admin Sign In
          </h2>
          <p className="text-xs text-stone-600">
            Secure portal for cattery inventory, availability toggling, and customer WhatsApp inquiries.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Username"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg shadow-purple-500/25 hover:shadow-xl transition flex items-center justify-center space-x-2"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-[#8B5CF6] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
