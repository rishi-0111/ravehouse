import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setErrorMessage('');

      // Try authenticating with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Local bypass for development ease (or if auth is not set up on target db yet)
        if (email === 'admin@ravehouse.in' && password === 'admin123') {
          localStorage.setItem('admin_logged_in', 'true');
          navigate('/admin/dashboard');
          return;
        }
        throw error;
      }

      localStorage.setItem('admin_logged_in', 'true');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center px-4 font-sans relative">
      {/* Background glowing circle */}
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl space-y-6 z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-950/40 border border-red-900/60 rounded-full text-[9px] text-red-400 font-bold uppercase tracking-widest mx-auto">
            <Sparkles size={10} />
            <span>SECURE ACCESS ONLY</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider">
            ADMIN <span className="text-red-500">PORTAL</span>
          </h2>
          <p className="text-zinc-500 text-xs font-light">Enter credentials to manage operations</p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-lg flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail size={14} />
              </span>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ravehouse.in"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock size={14} />
              </span>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Quick info note */}
          <div className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-lg text-[10px] text-zinc-400 font-light">
            <span className="font-semibold text-red-400">Demo Account Bypass:</span> Use email <code className="text-white select-all">admin@ravehouse.in</code> with password <code className="text-white select-all">admin123</code>.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-650 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg border border-red-500 transition-all duration-200"
          >
            {loading ? 'Authenticating...' : 'Sign In To Console'}
          </button>
        </form>

      </div>
    </div>
  );
}
