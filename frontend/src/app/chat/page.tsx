'use client';

import { useState } from 'react';
import { Send, Paperclip, Book, Bot, User, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy el núcleo de AAUCATools. Sube un libro o PDF y pregúntame lo que necesites.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Aquí conectaremos con el backend en el siguiente paso
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Recibido. Estoy analizando el documento para darte la respuesta más precisa basada en las fuentes.' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#020205] text-white">
      {/* Sidebar - Documentos */}
      <aside className="w-80 border-r border-white/10 glass flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Link href="/" className="hover:text-purple-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-bold text-lg">Biblioteca</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center gap-3 cursor-pointer">
            <Book className="w-5 h-5 text-purple-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Cálculo Diferencial.pdf</p>
              <p className="text-[10px] text-purple-400/70">Indexado - Pág. 450</p>
            </div>
          </div>
          <button className="w-full p-4 rounded-xl border border-dashed border-white/20 hover:border-purple-500/50 transition-all flex flex-col items-center gap-2 group">
            <Paperclip className="w-5 h-5 text-gray-500 group-hover:text-purple-400" />
            <span className="text-xs text-gray-500 group-hover:text-gray-300">Subir nuevo libro</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">Gemini 1.5 Flash Conectado</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-purple-600' : 'bg-white/10'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'assistant' ? 'glass border border-white/10' : 'bg-purple-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-8 pt-0">
          <div className="max-w-4xl mx-auto relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta algo sobre el libro..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
