'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Upload, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  BrainCircuit,
  FileText,
  Loader2,
  ChevronRight,
  Menu,
  X,
  History
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Cerrar sidebar al cambiar de archivo en móvil
  useEffect(() => {
    if (currentFile) setIsSidebarOpen(false);
  }, [currentFile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast("El archivo es demasiado grande (Máx 10MB)", "error");
      return;
    }

    setLoading(true);
    toast("Subiendo y analizando documento...", "success");
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl && process.env.NODE_ENV === 'production') {
        toast("Error: NEXT_PUBLIC_BACKEND_URL no configurada en Vercel", "error");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl || 'http://localhost:8000'}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Fallo en el servidor");
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        setCurrentFileId(data.file_id);
        setCurrentFile(file.name);
        toast("Documento listo para el chat", "success");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast(`Error: ${error.message || "No se pudo conectar con el backend"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl || 'http://localhost:8000'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
          question: userMessage,
          file_id: currentFileId || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error en la respuesta del motor");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast(`Fallo en la IA: ${error.message || "Conexión perdida"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSummary = async () => {
    if (!currentFileId) {
      toast("Sube un PDF primero para resumirlo", "warning");
      return;
    }
    setSummaryLoading(true);
    toast("Generando resumen con Gemini 3 Pro...", "success");
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Primero obtenemos el texto relevante (o una muestra) para resumir
      // Por simplicidad, el backend ya tiene el archivo, así que podríamos tener un endpoint /summarize-pdf
      // Pero como el backend actual espera 'text', vamos a enviar una petición de resumen
      
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
          question: "Por favor, genera un resumen ejecutivo y estructurado de este documento, destacando los puntos más importantes.",
          file_id: currentFileId
        })
      });
      
      if (!response.ok) throw new Error();
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `### 📝 Resumen Ejecutivo\n\n${data.response}` 
      }]);
    } catch (error) {
      toast("Error al generar el resumen. Verifica la conexión con el backend.", "error");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden relative font-sans">
      
      {/* Mobile Header - Visible solo en móviles */}
      <header className="md:hidden fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-black/5 z-[100] px-6 h-16 flex items-center justify-between">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-black uppercase tracking-tighter text-sm italic">Biblioteca <span className="text-yellow-500">IA</span></span>
        <button onClick={handleGetSummary} className="p-2 -mr-2 text-yellow-600">
          <Sparkles className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar / Drawer Responsive */}
      <AnimatePresence>
        {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.aside 
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed md:relative w-80 h-full border-r border-black/5 bg-gray-50 flex flex-col p-8 z-[200] md:z-10"
          >
            <div className="flex items-center justify-between mb-12">
              <Link href="/">
                <img src="/img/logo.png" alt="AAUCA" className="h-10" />
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-10">
              <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] mb-6">Gestión de PDF</h2>
              <button 
                onClick={() => document.getElementById('chat-pdf-upload')?.click()}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-black text-white flex items-center justify-center gap-3 text-sm font-black uppercase tracking-tighter hover:bg-gray-900 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-yellow-400" /> : <Upload className="w-4 h-4 text-yellow-400" />}
                {loading ? "PROCESANDO..." : "SUBIR DOCUMENTO"}
              </button>
              <input type="file" id="chat-pdf-upload" hidden accept=".pdf" onChange={handleFileUpload} />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              {currentFile ? (
                <div className="p-5 rounded-2xl bg-white border-2 border-yellow-400 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate uppercase text-black">{currentFile}</p>
                    <p className="text-[8px] text-green-600 font-black uppercase tracking-widest mt-1">Activo ahora</p>
                  </div>
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-black/5 rounded-3xl text-center">
                  <BookOpen className="w-8 h-8 text-black/10 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase text-gray-400 leading-relaxed">Sube un libro para comenzar el análisis</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-8 border-t border-black/5">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Desarrollado por Tranquilino Mba Ncogo</p>
              <div className="p-4 rounded-xl bg-white border border-black/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-black text-xs">A</div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black truncate uppercase">Estudiante AAUCA</p>
                  <p className="text-[8px] text-gray-500 font-bold uppercase">SAMSUNG A14 OPTIMIZED</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0">
        <header className="hidden md:flex p-8 border-b border-black/5 items-center justify-between bg-white">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <BrainCircuit className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter italic">Biblioteca <span className="text-yellow-600">Inteligente</span></h1>
              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Motor Gemini 3 Pro</p>
            </div>
          </div>
          <button 
            onClick={handleGetSummary}
            disabled={summaryLoading || !currentFileId}
            className="px-6 py-2.5 rounded-full bg-black text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-30"
          >
            {summaryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-400" />}
            Resumen Élite
          </button>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-8 no-scrollbar bg-white">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              {!currentFile && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-8 p-8 rounded-[3rem] bg-gray-50 border-2 border-dashed border-black/10 md:hidden"
                >
                  <Upload className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-sm font-black uppercase mb-6">Sube un documento para empezar</p>
                  <button 
                    onClick={() => document.getElementById('chat-pdf-upload')?.click()}
                    className="px-8 py-4 rounded-2xl bg-black text-white font-black text-xs uppercase"
                  >
                    Seleccionar PDF
                  </button>
                </motion.div>
              )}
              <div className="opacity-10">
                <History className="w-16 h-16 md:w-24 md:h-24 mb-6 mx-auto" />
                <h2 className="text-2xl md:text-3xl font-black uppercase italic">Sin actividad</h2>
                <p className="max-w-xs text-xs font-bold mt-2">Haz tu primera pregunta académica.</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] md:max-w-[70%] p-5 md:p-7 rounded-2xl md:rounded-[2.5rem] ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-black rounded-tl-none'}`}>
                <p className="text-sm md:text-base leading-relaxed font-medium">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-10 bg-white border-t border-black/5">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Haz tu pregunta..."
              className="flex-1 bg-gray-50 border-2 border-black/5 rounded-2xl px-6 py-4 focus:border-yellow-400 transition-all font-bold text-sm outline-none"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-20"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </main>

      {/* Overlay para cerrar sidebar en móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
