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
import { useToast } from '@/components/Toast';

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
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!file) return;
    setStatus('uploading');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_format', targetFormat);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/convert`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        setDownloadUrl(`${backendUrl}${data.download_url}`);
        setStatus('success');
        toast("Documento convertido con éxito", "success");
      }
    } catch (error) {
      toast("Error en la conversión. Revisa el formato del archivo.", "error");
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-12 relative overflow-hidden font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10 md:mb-16 pt-4 md:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">IA de Oficina v2.0</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 italic uppercase text-black leading-none">CONVERSOR <br className="md:hidden" /><span className="text-blue-600">TOTAL</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-[11px] max-w-xl">Transformación precisa de PDF a Word, Excel y PowerPoint.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Lado Izquierdo: Carga de Archivos */}
          <div className="space-y-8">
            <div 
              className={`border-2 border-dashed rounded-[3rem] p-12 text-center transition-all ${file ? 'border-blue-500 bg-blue-500/5' : 'border-black/10 hover:border-blue-500/50'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
            >
              <input type="file" id="pdf-upload" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".pdf" />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-black/5">
                  <Upload className={`w-10 h-10 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-2xl font-black mb-2 italic uppercase text-black">{file ? file.name : "Suelta tu PDF"}</h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">o haz clic para explorar</p>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] ml-4">Selecciona el formato de salida</h4>
              <div className="grid grid-cols-1 gap-3">
                {FORMATS.map((f) => (
                  <button 
                    key={f.id}
                    onClick={() => setTargetFormat(f.id)}
                    className={`flex items-center gap-4 p-6 rounded-3xl border transition-all ${targetFormat === f.id ? 'border-blue-500 bg-blue-500/10' : 'border-black/5 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className={`p-4 rounded-2xl ${f.bg} border border-black/5`}><f.icon className={`w-6 h-6 ${f.color}`} /></div>
                    <span className="font-black uppercase tracking-tight italic text-lg text-black/80">{f.label}</span>
                    {targetFormat === f.id && <div className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
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
