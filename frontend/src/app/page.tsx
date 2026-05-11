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
  Zap,
  Sparkles,
  Share2,
  Heart,
  Menu,
  X,
  Copy,
  MessageCircle,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userCount, setUserCount] = useState(1248);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Intentamos contar perfiles reales si existe la tabla
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          setUserCount(1248 + count);
        }
      } catch (e) {
        console.log("Usando contador base");
      }
    };
    fetchStats();
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const shareLink = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-yellow-500/30 relative">
      <div className="noise-overlay opacity-10" />

      {/* Top Support Banner */}
      <div className="bg-yellow-400 text-black py-2 px-4 text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 relative z-[110]">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 fill-current text-red-600" />
          <span>Ya somos <span className="underline font-black">{userCount.toLocaleString()}</span> estudiantes en la plataforma</span>
        </div>
        <button onClick={shareLink} className="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-900 transition-all flex items-center gap-2 text-[8px] md:text-[10px]">
          <Share2 className="w-3 h-3" /> Compartir enlace
        </button>
      </div>

      {/* Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-10 w-full z-[100] glass-aauca border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-1 bg-black/5 rounded-xl border border-black/10">
              <img src="/img/logo.png" alt="AAUCA Logo" className="h-10 w-auto rounded-lg" />
            </div>
            <div className="h-8 w-[1px] bg-black/10 mx-2 hidden sm:block"></div>
            <span className="font-black text-xl tracking-tighter uppercase hidden sm:block text-black">
              AAUCATools<span className="text-yellow-500">Community</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest">
              <a href="#herramientas" className="text-gray-500 hover:text-yellow-600 transition-colors">Herramientas</a>
              <Link href="/login" className="text-gray-500 hover:text-black transition-colors flex items-center gap-2">
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
              className="lg:hidden p-2 text-black hover:text-yellow-600 transition-colors"
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
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-black/5 p-6 flex flex-col gap-6 text-center uppercase font-black text-sm tracking-widest"
          >
            <a href="#herramientas" onClick={() => setIsMenuOpen(false)} className="text-gray-500">Herramientas</a>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-500">Iniciar Sesión</Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full py-4 rounded-2xl bg-yellow-400 text-black">Registrarse</button>
            </Link>
          </motion.div>
        )}
      </motion.nav>

      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/img/campus.png" alt="Campus AAUCA" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white"></div>
        </div>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700">Plataforma Académica Oficial</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.85] text-black">
            POTENCIA TU <br className="hidden md:block" /> ÉXITO ACADÉMICO.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            La navaja suiza de IA para el estudiante de la <span className="text-yellow-600 font-bold">AAUCA</span>. Convierte, transcribe y chatea con tus libros en un solo lugar.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login">
              <button className="group relative px-12 py-6 rounded-2xl bg-black text-white font-black text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center gap-3 uppercase">Empezar ahora <Zap className="w-6 h-6 text-yellow-400" /></span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Bento Grid Herramientas */}
      <section id="herramientas" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-8">
              <Code className="w-4 h-4 text-yellow-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700">Hub Tecnológico</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-black leading-[0.8] mb-8 text-shimmer-yellow">HERRAMIENTAS <br /> <span className="text-black">DE ÉXITO.</span></h2>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">IA de alta fidelidad diseñada para el rigor académico de la AAUCA.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="px-8 py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest shadow-2xl">REVISIÓN V.2.0</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          <ToolCard 
            href="/chat"
            className="md:col-span-2 md:row-span-2"
            icon={<Library className="w-16 h-16 md:w-24 md:h-24 text-yellow-500" />}
            title="Biblioteca Inteligente"
            desc="Sube tus libros y hazles preguntas en tiempo real. Análisis profundo potenciado por Gemini 1.5 Flash."
            tag="PREMIUM AI"
            color="border-yellow-400/20 hover:border-yellow-400"
          />
          <ToolCard 
            href="/convert"
            className="md:col-span-2"
            icon={<FileSpreadsheet className="w-16 h-16 text-blue-500" />}
            title="Conversor Total"
            desc="Transformación precisa de PDF a formatos editables de Office."
            tag="OFFICE ENGINE"
            color="border-blue-500/20 hover:border-blue-500"
          />
          <ToolCard 
            href="/transcribe"
            className="md:col-span-1"
            icon={<AudioLines className="w-16 h-16 text-green-600" />}
            title="Audio-Notas"
            desc="Transcripción perfecta de tus grabaciones."
            tag="WHISPER V3"
            color="border-green-500/20 hover:border-green-500"
          />
          <ToolCard 
            href="/chat"
            className="md:col-span-1"
            icon={<BrainCircuit className="w-16 h-16 text-yellow-500" />}
            title="Sintetizador"
            desc="Resúmenes ejecutivos de libros extensos."
            tag="GEMINI PRO"
            color="border-yellow-500/20 hover:border-yellow-500"
          />
        </div>
      </section>

      {/* 3. Filosofía */}
      <section id="nosotros" className="py-32 bg-gray-50 border-y border-black/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-[4rem] overflow-hidden border-4 border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] group">
            <img src="/img/puerta.png" alt="Entrada AAUCA" className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-12 text-black italic leading-none">FILOSOFÍA <br /> <span className="text-yellow-500">AAUCA.</span></h2>
            <div className="space-y-10">
              <PhilItem icon={<Users2 className="w-6 h-6 text-yellow-600" />} title="Por y para Oyala" desc="Nacido en el campus para elevar el nivel tecnológico de nuestra comunidad estudiantil." />
              <PhilItem icon={<ShieldCheck className="w-6 h-6 text-yellow-600" />} title="Privacidad Total" desc="Tus documentos son tuyos. No almacenamos datos sensibles en nuestros servidores." />
              <PhilItem icon={<Building2 className="w-6 h-6 text-yellow-600" />} title="Excelencia 2026" desc="Compromiso con la innovación constante en el corazón de Guinea Ecuatorial." />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Experience Showcase - Moved to bottom for better flow */}
      <section className="py-40 bg-white overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Explora el Campus</span>
          </div>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic text-black leading-[0.8] mb-12">CIUDAD <br /> DE LA <span className="text-yellow-500 text-shimmer-yellow">PAZ.</span></h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[11px] max-w-xl mx-auto">Vanguardia tecnológica en Guinea Ecuatorial.</p>
        </div>

        <div className="flex gap-8 px-6 overflow-x-auto pb-20 no-scrollbar snap-x">
          {[
            { img: "/img/campus.png", title: "CAMPUS OYALA", tag: "INFRAESTRUCTURA" },
            { img: "/img/puerta.png", title: "ENTRADA PRINCIPAL", tag: "AAUCA" },
            { img: "/img/conversor.png", title: "SISTEMA CONVERSOR", tag: "SOFTWARE" },
            { img: "/img/trancr.png", title: "NOTAS INTELIGENTES", tag: "AI MOTOR" },
            { img: "/img/audio.png", title: "INTERFAZ DE AUDIO", tag: "UX DESIGN" },
            { img: "/img/flujo.png", title: "FLUJO DE DATOS", tag: "BACKEND" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[300px] md:min-w-[500px] h-[400px] md:h-[600px] rounded-[4rem] overflow-hidden relative group snap-center shadow-2xl border-4 border-white"
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 mb-4">{item.tag}</span>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Open Source */}
      <section className="max-w-7xl mx-auto px-6 py-40 text-center">
        <div className="p-20 rounded-[4rem] bg-yellow-400 text-black relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
            <img src="/img/github.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-6xl font-black tracking-tighter mb-6 italic">¿ERES PROGRAMADOR?</h2>
            <p className="text-black/80 text-xl mb-12 max-w-2xl mx-auto font-black uppercase tracking-tight">Contribuye al desarrollo de la tecnología académica de la Ciudad de la Paz.</p>
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

      <footer className="py-20 border-t border-black/5 text-center bg-white">
        <img src="/img/logo.png" alt="Logo Footer" className="h-16 mx-auto mb-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer" />
        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-yellow-600 mb-4">AAUCAToolsCommunity © 2026</p>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-2">Desarrollado por <span className="text-yellow-600">Tranquilino Mba Ncogo</span></p>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">CIUDAD DE LA PAZ • OYALA • 11/05/2026</p>
      </footer>

      {/* 5. Share Modal Pro */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            onClick={() => setIsShareModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-black/5"
          >
            <div className="absolute top-8 right-8 z-10">
              <button onClick={() => setIsShareModalOpen(false)} className="p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all">
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-8">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700">Expandir la Comunidad</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase text-black">COMPARTE <span className="text-yellow-500">AAUCATOOLS</span></h2>
              <p className="text-gray-500 font-medium mb-12 text-lg">Ayuda a tus compañeros de la <span className="text-yellow-600 font-bold">AAUCA</span> a potenciar su éxito académico con IA.</p>

              {/* QR Code Section */}
              <div className="bg-gray-50 p-8 rounded-[3rem] mb-12 border border-black/5 inline-block mx-auto group">
                <div className="bg-white p-4 rounded-3xl shadow-xl border border-black/5 group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://aauca-tools-community.vercel.app')}`} 
                    alt="QR Code" 
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-6">Escanea para acceder</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const text = encodeURIComponent("🚀 ¡Mira esta plataforma de IA para estudiantes de la AAUCA! Convierte archivos, transcribe clases y chatea con tus libros. Únete aquí: https://aauca-tools-community.vercel.app");
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#25D366] text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20"
                >
                  <MessageCircle className="w-6 h-6" /> WHATSAPP
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("https://aauca-tools-community.vercel.app");
                    toast("Enlace copiado. ¡Gracias por compartir!", "success");
                  }}
                  className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-black text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                >
                  <Copy className="w-6 h-6" /> COPIAR ENLACE
                </button>
              </div>
            </div>
            <div className="bg-yellow-400 py-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black">Ciudad de la Paz • Oyala • AAUCA 2026</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ icon, title, desc, className, href, tag, color }: { icon: React.ReactNode, title: string, desc: string, className?: string, href: string, tag: string, color?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }} 
      className={`group relative p-10 rounded-[3rem] bg-gray-50 border-2 transition-all duration-500 flex flex-col justify-between ${color || 'border-black/5'} ${className}`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div className="p-5 rounded-3xl bg-white shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 border border-black/5 px-3 py-1.5 rounded-full">{tag}</span>
      </div>
      
      <div className="relative z-10 mt-8">
        <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase italic text-black/90">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed font-medium mb-8">{desc}</p>
        
        <Link href={href}>
          <button className="w-full py-4 rounded-2xl bg-white border border-black/5 text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
            Abrir herramienta <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
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
