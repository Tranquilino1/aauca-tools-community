'use client';

import { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ text: input })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'ai' as const, content: data.summary }]);
    } catch (error) {
      alert("Error al conectar con la IA");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSummary = async () => {
    setSummaryLoading(true);
    // Simulación de resumen de libro largo con Gemini
    setTimeout(() => {
      setMessages([...messages, { 
        role: 'ai', 
        content: "### Resumen Ejecutivo del Libro\n\nEste documento trata sobre los fundamentos de la Inteligencia Artificial aplicados a la educación. Los puntos clave son:\n1. Personalización del aprendizaje.\n2. Automatización de tareas administrativas.\n3. Ética en el uso de algoritmos." 
      }]);
      setSummaryLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - Gestión de Documentos */}
      <aside className="w-80 border-r border-white/5 bg-white/2 flex flex-col p-6 hidden md:flex">
        <div className="mb-10">
          <img src="/img/logo.png" alt="AAUCA" className="h-10 mb-6 opacity-80" />
          <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Mis Documentos</h2>
        </div>
        
        <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 mb-8 text-sm font-bold">
          <Upload className="w-4 h-4" /> Subir Libro (PDF)
        </button>

        <div className="flex-1 space-y-4">
          <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center gap-4 group cursor-pointer">
            <FileText className="w-5 h-5 text-yellow-400" />
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">Calculo_Diferencial.pdf</p>
              <p className="text-[9px] text-yellow-400/50 uppercase font-bold">Analizado</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal de Chat */}
      <main className="flex-1 flex flex-col relative">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <BrainCircuit className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest italic">BIBLIOTECA <span className="text-yellow-400">INTELIGENTE</span></h1>
              <p className="text-[10px] font-bold text-gray-500">GEMINI 1.5 FLASH ACTIVE</p>
            </div>
          </div>
          <button 
            onClick={handleGetSummary}
            disabled={summaryLoading}
            className="px-6 py-2.5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all"
          >
            {summaryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Resumen de Élite
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <MessageSquare className="w-24 h-24 mb-6" />
              <h2 className="text-3xl font-black italic uppercase">Inicia la conversación</h2>
              <p className="max-w-md font-bold mt-2">Haz preguntas sobre tus PDFs o pide un resumen estructurado del contenido.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-6 rounded-[2rem] ${msg.role === 'user' ? 'bg-yellow-400 text-black font-bold' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-6 rounded-[2rem] flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
                <span className="text-sm font-bold italic opacity-50">IA pensando...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 md:p-12 bg-gradient-to-t from-black to-transparent">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta algo sobre el libro o pide un resumen..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-8 pr-20 focus:border-yellow-400 transition-all font-medium text-lg outline-none backdrop-blur-xl"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-yellow-400 rounded-2xl text-black hover:bg-yellow-300 transition-all shadow-xl"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
