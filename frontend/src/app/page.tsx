'use client';

import { 
  Library,
  FileSpreadsheet,
  AudioLines,
  BrainCircuit,
  Zap, 
  ArrowRight, 
  Code2, 
  Sparkles,
  ShieldCheck,
  Building2,
  Users2,
  UserPlus,
  LogIn,
  Share2,
  Heart,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [userCount, setUserCount] = useState(1248);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count, error } = await supabase
          .from('document_chunks')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count) {
          setUserCount(1248 + count);
        }
      } catch (e) {
        console.log("Fallback a contador estático");
      }
    };
    fetchStats();
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("¡Enlace copiado! Compártelo con tus compañeros de la AAUCA.");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 relative">
      <div className="noise-overlay" />

      {/* Top Support Banner */}
      <div className="bg-yellow-400 text-black py-2 px-4 text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 relative z-[110]">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 fill-current" />
          <span>Ya somos <span className="underline">{userCount.toLocaleString()}</span> estudiantes en la plataforma</span>
        </div>
        <button onClick={shareLink} className="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-900 transition-all flex items-center gap-2 text-[8px] md:text-[10px]">
          <Share2 className="w-3 h-3" /> Compartir enlace
        </button>
      </div>

      {/* Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-10 w-full z-[100] glass-aauca border-b border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-1 bg-white/5 rounded-xl border border-white/10">
              <img src="/img/logo.png" alt="AAUCA Logo" className="h-10 w-auto rounded-lg" />
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
            <span className="font-black text-xl tracking-tighter uppercase hidden sm:block">
              AAUCATools<span className="text-yellow-400">Community</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest">
              <a href="#herramientas" className="text-gray-400 hover:text-yellow-400 transition-colors">Herramientas</a>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </Link>
              <Link href="/register">
                <button className="px-6 py-2.5 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all font-black shadow-lg shadow-yellow-500/20 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Registrarse
                </button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-yellow-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-yellow-500/10 p-6 flex flex-col gap-6 text-center uppercase font-black text-sm tracking-widest"
          >
            <a href="#herramientas" onClick={() => setIsMenuOpen(false)} className="text-gray-400">Herramientas</a>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-400">Iniciar Sesión</Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full py-4 rounded-2xl bg-yellow-400 text-black">Registrarse</button>
            </Link>
          </motion.div>
        )}
      </motion.nav>

      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/img/campus.png" alt="Campus AAUCA" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        </div>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-200">Plataforma Académica Oficial</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.85] text-shimmer-yellow">
            POTENCIA TU <br className="hidden md:block" /> ÉXITO ACADÉMICO.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            La navaja suiza de IA para el estudiante de la <span className="text-yellow-400 font-bold">AAUCA</span>. Convierte, transcribe y chatea con tus libros en un solo lugar.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/chat">
              <button className="px-12 py-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all font-black text-xl flex items-center gap-3 yellow-glow">
                Empezar a estudiar <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Bento Grid Herramientas */}
      <section id="herramientas" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Nuestras <span className="text-yellow-400">Herramientas</span></h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Tecnología de última generación al servicio del estudiante</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          <ToolCard 
            href="/chat"
            className="md:col-span-2 md:row-span-2"
            icon={<Library className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />}
            title="Biblioteca Inteligente"
            desc="Sube tus libros y hazles preguntas. Potenciado por Gemini 1.5 Flash para un análisis profundo."
            tag="IA AVANZADA"
            image="/img/flujo.png"
            color="border-yellow-400/20 hover:border-yellow-400"
          />
          <ToolCard 
            href="/convert"
            className="md:col-span-2"
            icon={<FileSpreadsheet className="w-16 h-16 text-blue-400" />}
            title="Conversor Total"
            desc="PDF a Word, Excel o PPT en segundos manteniendo el diseño."
            tag="DOCUMENTOS"
            image="/img/conversor.png"
            color="border-blue-500/20 hover:border-blue-500"
          />
          <ToolCard 
            href="/transcribe"
            className="md:col-span-1"
            icon={<AudioLines className="w-16 h-16 text-green-400" />}
            title="Audio-Notas"
            desc="Transcripción de clases grabadas."
            tag="WHISPER V3"
            image="/img/audio.png"
            color="border-green-500/20 hover:border-green-500"
          />
          <ToolCard 
            href="/chat"
            className="md:col-span-1"
            icon={<BrainCircuit className="w-16 h-16 text-yellow-400" />}
            title="Sintetizador"
            desc="Resúmenes de libros de 500+ páginas."
            tag="GEMINI FLASH"
            color="border-yellow-500/20 hover:border-yellow-500"
          />
        </div>
      </section>

      {/* 3. Filosofía */}
      <section id="nosotros" className="py-32 bg-white/5 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-[3rem] overflow-hidden border border-yellow-500/20 group">
            <img src="/img/puerta.png" alt="Entrada AAUCA" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-12 text-shimmer-yellow">FILOSOFÍA <br /> COMUNITARIA.</h2>
            <div className="space-y-10">
              <PhilItem icon={<Users2 className="w-6 h-6 text-yellow-400" />} title="Hecho por la Comunidad" desc="Un proyecto nacido en el campus de la Ciudad de la Paz para resolver problemas reales de nuestros estudiantes." />
              <PhilItem icon={<ShieldCheck className="w-6 h-6 text-yellow-400" />} title="Privacidad Local" desc="Tus documentos se procesan de forma segura. No almacenamos tus datos personales ni tus archivos de forma permanente." />
              <PhilItem icon={<Building2 className="w-6 h-6 text-yellow-400" />} title="Excelencia AAUCA" desc="Tecnología de punta aplicada al rigor académico que nos caracteriza." />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Open Source */}
      <section className="max-w-7xl mx-auto px-6 py-40 text-center">
        <div className="p-20 rounded-[4rem] bg-yellow-400 text-black relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <img src="/img/github.png" alt="" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="relative z-10">
            <h2 className="text-6xl font-black tracking-tighter mb-6 italic">¿ERES PROGRAMADOR?</h2>
            <p className="text-black/80 text-xl mb-12 max-w-2xl mx-auto font-bold uppercase tracking-tight">Contribuye al desarrollo de la tecnología académica de la Ciudad de la Paz.</p>
            <a 
              href="https://github.com/Tranquilino1/aauca-tools-community"
              target="_blank"
              className="px-12 py-5 rounded-2xl bg-black text-white font-black text-lg flex items-center gap-4 mx-auto hover:bg-gray-900 transition-all w-fit shadow-2xl"
            >
              <Code2 className="w-6 h-6" /> VER EN GITHUB
            </a>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <img src="/img/logo.png" alt="Logo Footer" className="h-16 mx-auto mb-8 opacity-50 grayscale hover:grayscale-0 transition-all" />
        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-yellow-400 mb-4">AAUCAToolsCommunity</p>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">CIUDAD DE LA PAZ • OYALA • GUINEA ECUATORIAL</p>
      </footer>
    </div>
  );
}

function ToolCard({ icon, title, desc, className, href, tag, image, color }: { icon: React.ReactNode, title: string, desc: string, className?: string, href: string, tag: string, image?: string, color?: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className={`group relative p-10 rounded-[3rem] glass-card-aauca flex flex-col justify-between overflow-hidden border transition-all ${color || 'border-white/5'} ${className}`}>
      <Link href={href} className="absolute inset-0 z-20" />
      
      {image && (
        <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
          <img src={image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 flex justify-between items-start">
        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full">{tag}</span>
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-black mb-3 group-hover:text-yellow-400 transition-colors uppercase italic tracking-tighter">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
}

function PhilItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">{icon}</div>
      <div>
        <h4 className="text-xl font-black tracking-tight mb-2 uppercase">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
