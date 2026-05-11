'use client';

import { useState } from 'react';
import { Mic, Upload, Loader2, ChevronLeft, Copy, Check, FileAudio } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTranscribe = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error en la transcripción:", error);
      alert("Hubo un error al procesar el audio.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Volver al Inicio
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Transcripción de Audio
          </h1>
          <p className="text-gray-400">Convierte tus grabaciones de clase en texto usando Groq Whisper-3.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-center items-center text-center h-fit">
            {!file ? (
              <label className="flex flex-col items-center gap-6 cursor-pointer group w-full py-12">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/5 transition-all">
                  <Mic className="w-10 h-10 text-purple-400" />
                </div>
                <p className="text-lg font-semibold">Sube un archivo de audio</p>
                <p className="text-xs text-gray-500">MP3, WAV, M4A soportados</p>
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            ) : (
              <div className="space-y-6 w-full">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <FileAudio className="w-8 h-8 text-purple-400" />
                  <div className="text-left overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">Listo para transcribir</p>
                  </div>
                </div>
                <button 
                  onClick={handleTranscribe}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 transition-all font-bold flex items-center justify-center gap-2 glow disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                  ) : (
                    "Comenzar Transcripción"
                  )}
                </button>
                <button onClick={() => {setFile(null); setTranscription('');}} className="text-sm text-gray-500 hover:text-white">
                  Cambiar archivo
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Resultado</h3>
              {transcription && (
                <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 text-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              )}
            </div>
            <div className="flex-1 bg-black/20 rounded-2xl p-4 overflow-y-auto text-sm leading-relaxed text-gray-300">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500 italic">
                  Escuchando y procesando...
                </div>
              ) : transcription ? (
                transcription
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 italic gap-4">
                  <Mic className="w-8 h-8 opacity-20" />
                  El texto aparecerá aquí.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
