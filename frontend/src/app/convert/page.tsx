'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Upload, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  FileDown
} from 'lucide-react';
import { uploadDocument } from '@/lib/api';

const FORMATS = [
  { id: 'docx', label: 'Microsoft Word', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'xlsx', label: 'Microsoft Excel', icon: FileSpreadsheet, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'pptx', label: 'PowerPoint', icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('docx');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'converting' | 'success'>('idle');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleConvert = async () => {
    if (!file) return;
    setStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_format', targetFormat);
      
      const response = await fetch('http://localhost:8000/convert', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setDownloadUrl(`http://localhost:8000${data.download_url}`);
        setStatus('success');
      }
    } catch (error) {
      alert("Error en la conversión");
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 italic">CONVERSOR <span className="text-yellow-400">TOTAL</span></h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Transforma tus PDFs al formato que necesites en segundos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Lado Izquierdo: Carga de Archivos */}
          <div className="space-y-8">
            <div 
              className={`border-2 border-dashed rounded-[3rem] p-12 text-center transition-all ${file ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 hover:border-yellow-400/50'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
            >
              <input type="file" id="pdf-upload" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".pdf" />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Upload className={`w-10 h-10 ${file ? 'text-yellow-400' : 'text-gray-500'}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{file ? file.name : "Suelta tu PDF aquí"}</h3>
                <p className="text-sm text-gray-500 font-medium">o haz clic para buscar en tu dispositivo</p>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-4">Selecciona el formato de salida</h4>
              <div className="grid grid-cols-1 gap-3">
                {FORMATS.map((f) => (
                  <button 
                    key={f.id}
                    onClick={() => setTargetFormat(f.id)}
                    className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${targetFormat === f.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className={`p-3 rounded-2xl ${f.bg}`}><f.icon className={`w-6 h-6 ${f.color}`} /></div>
                    <span className="font-bold">{f.label}</span>
                    {targetFormat === f.id && <CheckCircle2 className="w-5 h-5 text-yellow-400 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Estado y Acciones */}
          <div className="flex flex-col justify-center items-center text-center p-12 glass-card-aauca rounded-[3rem] border border-white/5 min-h-[400px]">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <FileText className="w-12 h-12 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">Listo para empezar</h3>
                  <p className="text-gray-500 text-sm mb-8 font-medium">Carga un archivo para activar el motor de conversión inteligente.</p>
                  <button 
                    onClick={handleConvert}
                    disabled={!file}
                    className="px-10 py-5 rounded-2xl bg-yellow-400 text-black font-black text-lg disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-3 yellow-glow"
                  >
                    Convertir Ahora <ArrowRight className="w-6 h-6" />
                  </button>
                </motion.div>
              )}

              {status === 'uploading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mb-6" />
                  <h3 className="text-2xl font-black italic">PROCESANDO...</h3>
                  <p className="text-gray-500 font-bold mt-2">La IA está reconstruyendo el documento</p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">¡LOGRADO!</h3>
                  <p className="text-gray-500 mb-8 font-medium">Tu archivo está optimizado y listo para descargar.</p>
                  <a 
                    href={downloadUrl} 
                    download
                    className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-100 transition-all flex items-center gap-3 shadow-2xl"
                  >
                    Descargar Archivo <FileDown className="w-6 h-6" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
