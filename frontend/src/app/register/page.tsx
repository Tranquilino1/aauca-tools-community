'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) alert(error.message);
    else alert("¡Registro exitoso! Revisa tu correo para confirmar.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img src="/img/campus.png" alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/90 to-green-900/20" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/">
            <div className="relative inline-block mb-6 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <img src="/img/logo.png" alt="Logo" className="relative h-20 w-auto rounded-xl border border-white/10 bg-black shadow-2xl" />
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">ÚNETE A LA <span className="text-green-400">ERA IA</span></h1>
          <p className="text-gray-500 mt-3 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-yellow-400" /> Registro Académico Oficial
          </p>
        </div>

        <div className="glass-card-aauca p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent blur-2xl" />
          
          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-400 outline-none transition-all font-medium placeholder:text-gray-700"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Correo Institucional</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-yellow-400 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-yellow-400 outline-none transition-all font-medium placeholder:text-gray-700"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400 text-black font-black text-lg hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
            >
              {loading ? "Creando..." : "Crear Mi Cuenta"} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-gray-500 font-bold">
            ¿Ya eres miembro? <Link href="/login" className="text-blue-400 hover:underline">Inicia sesión aquí</Link>
          </p>
        </div>
        
        <p className="text-center mt-12 text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
          Innovación • Rigor • Comunidad
        </p>
      </motion.div>
    </div>
  );
}
