'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Upload, 
  Loader2, 
  Copy, 
  FileText, 
  CheckCircle2,
  Volume2
} from 'lucide-react';

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [result, setResult] = useState('');

  const handleTranscribe = async () => {
    if (!file) return;
    setStatus('processing');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data.text);
      setStatus('done');
    } catch (error) {
      alert("Error en la transcripción");
      setStatus('idle');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("Texto copiado al portapapeles");
  };

  return (    <div className="min-h-screen bg-white text-black p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <img src="/img/trancr.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Powered by Whisper-v3 Large</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 italic uppercase text-black">AUDIO <span className="text-green-600">NOTAS</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[11px] max-w-2xl">Transcripción instantánea de alta fidelidad para clases, conferencias y seminarios académicos.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Panel de Carga */}
          <div className="lg:col-span-1 space-y-8">
            <div 
              className={`border-2 border-dashed rounded-[3rem] p-10 text-center transition-all ${file ? 'border-green-500 bg-green-500/5' : 'border-black/10 hover:border-green-500/50'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
            >
              <input type="file" id="audio-upload" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} accept="audio/*" />
              <label htmlFor="audio-upload" className="cursor-pointer block">
                <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-black/5">
                  <Mic className={`w-10 h-10 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-xl font-black mb-1 uppercase italic tracking-tighter text-black">{file ? file.name : "Subir grabación"}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MP3, WAV, M4A</p>
              </label>
            </div>

            <button 
              onClick={handleTranscribe}
              disabled={!file || status === 'processing'}
              className="w-full py-6 rounded-2xl bg-green-600 text-white font-black text-xl disabled:opacity-30 transition-all flex items-center justify-center gap-4 shadow-xl shadow-green-500/20 hover:bg-green-500"
            >
              {status === 'processing' ? <Loader2 className="animate-spin w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              {status === 'processing' ? "PROCESANDO..." : "TRANSCRIBIR AHORA"}
            </button>
          </div>

          {/* Panel de Resultado */}
          <div className="lg:col-span-2">
            <div className="glass-card-aauca rounded-[3rem] border border-white/5 bg-white/2 min-h-[500px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                {status === 'done' && (
                  <div className="flex gap-4">
                    <button onClick={copyToClipboard} className="text-xs font-black uppercase text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                      <Copy className="w-4 h-4" /> Copiar
                    </button>
                    <button className="text-xs font-black uppercase text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                      <FileText className="w-4 h-4" /> Exportar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Volume2 className="w-20 h-20 mb-6" />
                      <p className="text-xl font-bold italic uppercase tracking-tighter">Esperando entrada de audio...</p>
                    </motion.div>
                  )}

                  {status === 'processing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse" style={{ width: `${100 - i * 15}%` }} />
                      ))}
                    </motion.div>
                  )}

                  {status === 'done' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-[1.8] text-lg font-medium whitespace-pre-wrap selection:bg-yellow-400/30">
                        {result}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
