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
      <div className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 text-black py-2 px-4 text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 relative z-[110]">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 fill-current" />
          <span>Ya somos <span className="underline font-bold text-black/80">{userCount.toLocaleString()}</span> estudiantes innovando en la AAUCA</span>
        </div>
        <button onClick={shareLink} className="bg-black/20 backdrop-blur-md text-black px-3 py-1 rounded-full hover:bg-black/30 transition-all flex items-center gap-2 text-[8px] md:text-[10px] font-bold border border-black/10">
          <Share2 className="w-3 h-3" /> Compartir plataforma
        </button>
      </div>

      {/* Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-10 w-full z-[100] glass-aauca border-b border-white/5">
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
          <img src="/img/campus.png" alt="Campus AAUCA" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black"></div>
          {/* Decorative Blooms */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
        </div>
        
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Inteligencia Artificial para la <span className="text-yellow-400">Excelencia</span></span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-[7.5rem] font-black tracking-tighter mb-8 leading-[1] md:leading-[0.85] text-white">
            ESTUDIA CON <br className="hidden md:block" /> <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 bg-clip-text text-transparent italic">SUPERPODERES.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            La plataforma definitiva de la <span className="text-white font-bold">AAUCA</span> para convertir documentos, transcribir clases y chatear con tus libros usando el motor de Google Gemini.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/chat">
              <button className="px-12 py-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all font-black text-xl flex items-center gap-3 yellow-glow group">
                Empezar Ahora <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-black overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-black bg-yellow-400 text-black flex items-center justify-center text-[10px] font-black">
                +1K
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Herramientas con Colores e Imágenes */}
      <section id="herramientas" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">MOTOR <span className="text-yellow-400">ACADÉMICO</span></h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Herramientas de última generación diseñadas para el campus de la Ciudad de la Paz.</p>
          </div>
          <div className="flex gap-2">
             <div className="w-12 h-1 bg-yellow-400 rounded-full" />
             <div className="w-8 h-1 bg-green-400 rounded-full" />
             <div className="w-4 h-1 bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[350px]">
          {/* Biblioteca Inteligente - BLUE */}
          <ToolCard 
            href="/chat"
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20"
            icon={<Library className="w-12 h-12 text-blue-400" />}
            title="Biblioteca Inteligente"
            desc="Sube tus libros y hazles preguntas complejas. La IA entiende el contexto de todo el documento."
            tag="Gemini 1.5 Pro"
            image="/img/audio.png"
            color="text-blue-400"
          />
          
          {/* Conversor Total - GREEN */}
          <ToolCard 
            href="/convert"
            className="md:col-span-2 bg-gradient-to-br from-green-500/20 to-transparent border-green-500/20"
            icon={<FileSpreadsheet className="w-12 h-12 text-green-400" />}
            title="Conversor de Élite"
            desc="Transforma PDF a Word o Excel manteniendo tablas y formato perfecto."
            tag="Reconstructor PDF"
            image="/img/conversor.png"
            color="text-green-400"
          />

          {/* Audio-Notas - YELLOW */}
          <ToolCard 
            href="/transcribe"
            className="md:col-span-1 bg-gradient-to-br from-yellow-400/10 to-transparent border-yellow-400/20"
            icon={<AudioLines className="w-12 h-12 text-yellow-400" />}
            title="Audio-Notas"
            desc="Transcribe clases grabadas al instante."
            tag="Whisper-v3"
            image="/img/trancr.png"
            color="text-yellow-400"
          />

          {/* Sintetizador - PURPLE/BLUE */}
          <ToolCard 
            href="/chat"
            className="md:col-span-1 bg-gradient-to-br from-blue-400/10 to-transparent border-blue-400/20"
            icon={<BrainCircuit className="w-12 h-12 text-blue-300" />}
            title="Sintetizador"
            desc="Resúmenes ejecutivos de libros largos."
            tag="Fast Mode"
            image="/img/flujo.png"
            color="text-blue-300"
          />
        </div>
      </section>

      {/* 3. Filosofía con Imagen Puerta */}
      <section id="nosotros" className="py-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-[4rem] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />
            <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10">
              <img src="/img/puerta.png" alt="Entrada AAUCA" className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <span className="px-4 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest">Campus Oyala</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-6xl font-black tracking-tighter mb-12 italic uppercase leading-[0.9]">IDENTIDAD <br /> <span className="text-yellow-400">AAUCA.</span></h2>
            <div className="space-y-12">
              <PhilItem 
                icon={<Users2 className="w-6 h-6 text-green-400" />} 
                title="Soberanía Tecnológica" 
                desc="Desarrollamos herramientas propias para no depender de soluciones externas costosas." 
              />
              <PhilItem 
                icon={<ShieldCheck className="w-6 h-6 text-blue-400" />} 
                title="Privacidad del Estudiante" 
                desc="Tus archivos académicos son privados. No entrenamos modelos con tus datos." 
              />
              <PhilItem 
                icon={<Building2 className="w-6 h-6 text-yellow-400" />} 
                title="Impacto Regional" 
                desc="Liderando la innovación educativa en Guinea Ecuatorial y toda África Central." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Open Source / GitHub Section */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="p-10 md:p-20 rounded-[4rem] bg-white text-black relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 blur-[80px] -mr-32 -mt-32" />
          <div className="relative z-10 flex-1">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic uppercase leading-[0.85]">COMUNIDAD <br /> <span className="text-gray-400 italic">OPEN SOURCE</span></h2>
            <p className="text-black/60 text-xl mb-12 max-w-xl font-bold leading-relaxed">¿Eres de Informática o Sistemas? Únete al repositorio oficial y ayúdanos a construir el futuro de la educación en la AAUCA.</p>
            <Link href="https://github.com/Tranquilino1/aauca-tools-community">
              <button className="px-10 py-5 rounded-2xl bg-black text-white font-black flex items-center gap-4 hover:bg-gray-800 transition-all text-lg shadow-2xl">
                <Code2 className="w-6 h-6" /> Contribuir en GitHub
              </button>
            </Link>
          </div>
          <div className="w-full md:w-1/3 relative group">
            <img src="/img/github.png" alt="Github" className="w-full h-auto rounded-3xl shadow-2xl group-hover:rotate-2 transition-transform duration-500" />
            <div className="absolute -bottom-6 -right-6 bg-yellow-400 p-6 rounded-2xl shadow-xl">
               <Zap className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 text-center bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <img src="/img/logo.png" alt="Logo Footer" className="h-16 mx-auto mb-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <div className="flex justify-center gap-8 mb-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <a href="#" className="hover:text-yellow-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-green-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contacto</a>
          </div>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white mb-4">AAUCAToolsCommunity <span className="text-yellow-400">v2.0</span></p>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-600">CIUDAD DE LA PAZ • OYALA • GUINEA ECUATORIAL</p>
        </div>
      </footer>
    </div>
  );
}

function ToolCard({ icon, title, desc, className, href, tag, image, color }: { icon: React.ReactNode, title: string, desc: string, className?: string, href: string, tag: string, image: string, color: string }) {
  return (
    <motion.div whileHover={{ y: -8 }} className={`group relative p-8 rounded-[3rem] border bg-black/40 backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-500 ${className}`}>
      <Link href={href} className="absolute inset-0 z-20" />
      
      {/* Hover Image Reveal */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
        <img src={image} alt={title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
      </div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-3 py-1 bg-white/5 rounded-full border border-white/5">{tag}</span>
      </div>

      <div className="relative z-10">
        <h3 className={`text-2xl font-black mb-3 group-hover:translate-x-1 transition-transform duration-300 ${color}`}>{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed font-bold group-hover:text-gray-300 transition-colors mb-6">{desc}</p>
        
        {/* Tool Preview Image (Small) */}
        <div className="h-20 w-full rounded-2xl overflow-hidden border border-white/5 opacity-40 group-hover:opacity-100 transition-all">
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
        </div>
      </div>
    </motion.div>
  );
}

function PhilItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">{icon}</div>
      <div>
        <h4 className="text-2xl font-black tracking-tight mb-2 uppercase italic group-hover:text-white transition-colors">{title}</h4>
        <p className="text-gray-500 text-base leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
