'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Code } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.48-3.48C18.1 1.34 15.3 0 12 0 7.31 0 3.32 2.67 1.38 6.58L5.12 9.5C6.01 6.92 8.51 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z" />
    <path fill="#FBBC05" d="M5.12 14.5c-.23-.69-.35-1.42-.35-2.18s.12-1.49.35-2.18L1.38 6.58C.5 8.21 0 10.05 0 12s.5 3.79 1.38 5.42l3.74-2.92z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.47 1.15-4.23 1.15-3.26 0-6.03-2.2-7.01-5.18L1.24 17.11C3.21 21.3 7.39 24 12 24z" />
  </svg>
);

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Por favor, completa todos los campos.", "error");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast("Credenciales incorrectas. Revisa tu correo y contraseña.", "error");
    } else {
      toast("¡Bienvenido de nuevo!");
      window.location.href = '/chat';
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast("Error de Google: Asegúrate de añadir la URL de Vercel en 'Redirect URLs' de Supabase.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-100/50 via-white to-white opacity-100" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[120px] -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] -ml-72 -mb-72" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <Link href="/">
            <div className="relative inline-block group">
              <img src="/img/logo.png" alt="Logo" className="h-24 mx-auto mb-8 rounded-[2rem] border-2 border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-[2rem] bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </div>
          </Link>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-black leading-none mb-4">MÁS QUE <br /> <span className="text-yellow-500">IA.</span></h1>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em]">Plataforma oficial AAUCA</p>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border-2 border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500"></div>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-5 px-6 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-4 hover:bg-gray-50 border-2 border-black/5 transition-all mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] active:scale-[0.98]"
          >
            <GoogleIcon />
            <span className="uppercase tracking-tighter">Continuar con Google</span>
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <span className="relative px-4 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">O con tu correo</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Correo Institucional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-400 outline-none transition-all font-semibold"
                  placeholder="estudiante@aauca.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-400 outline-none transition-all font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-yellow-400 text-black font-black text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 font-bold">
            ¿No tienes cuenta? <Link href="/register" className="text-yellow-600 hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
