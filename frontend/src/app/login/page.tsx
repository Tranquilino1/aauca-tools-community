'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, ArrowRight, Code } from 'lucide-react';
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/">
            <img src="/img/logo.png" alt="Logo" className="h-16 mx-auto mb-6 rounded-xl border border-white/10" />
          </Link>
          <h1 className="text-4xl font-black tracking-tighter">BIENVENIDO A <span className="text-yellow-400 italic">AAUCA</span></h1>
          <p className="text-gray-500 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Accede a tu cuenta académica</p>
        </div>

        <div className="glass-card-aauca p-8 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-2xl shadow-2xl">
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-4 hover:bg-gray-100 transition-all mb-8 shadow-xl"
          >
            <Globe className="w-6 h-6 text-red-500" />
            Continuar con Google
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative px-4 bg-black/50 text-[10px] font-black text-gray-500 uppercase tracking-widest">O con tu correo</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Correo Institucional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-400 outline-none transition-all font-medium"
                  placeholder="estudiante@aauca.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-400 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-yellow-400 text-black font-black text-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-3"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 font-bold">
            ¿No tienes cuenta? <Link href="/register" className="text-yellow-400 hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
