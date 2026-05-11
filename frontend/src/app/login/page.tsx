'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Chrome, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/chat';
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img src="/img/campus.png" alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-blue-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/">
            <div className="relative inline-block mb-6 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <img src="/img/logo.png" alt="Logo" className="relative h-20 w-auto rounded-xl border border-white/10 bg-black" />
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter">PORTAL <span className="text-yellow-400 italic">ACADÉMICO</span></h1>
          <p className="text-gray-500 mt-3 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-green-400" /> Identidad Digital AAUCA
          </p>
        </div>

        <div className="glass-card-aauca p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent blur-2xl" />
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-4 hover:bg-gray-100 transition-all mb-8 shadow-xl relative z-10 group"
          >
            <Chrome className="w-6 h-6 text-red-500" />
            Continuar con Google
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative px-6 bg-black/40 text-[9px] font-black text-gray-500 uppercase tracking-widest backdrop-blur-sm">Credenciales Locales</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Correo Institucional</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-green-400 outline-none transition-all font-medium placeholder:text-gray-700"
                    placeholder="estudiante@aauca.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Contraseña</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-green-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-400 outline-none transition-all font-medium placeholder:text-gray-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 text-black font-black text-lg hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
            >
              {loading ? "Iniciando..." : "Entrar al Sistema"} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-gray-500 font-bold">
            ¿Nuevo en la comunidad? <Link href="/register" className="text-green-400 hover:underline">Crea tu cuenta</Link>
          </p>
        </div>
        
        <p className="text-center mt-12 text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
          Ciudad de la Paz • Guinea Ecuatorial
        </p>
      </motion.div>
    </div>
  );
}
