'use client';

import { useState } from 'react';
import { FileText, Download, Upload, Loader2, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Subir primero el archivo al almacenamiento (opcional, pero el endpoint actual usa file_name)
      // Para simplificar, usaremos un nuevo endpoint o el actual si pasamos el archivo directo.
      // Vamos a ajustar el backend para que acepte el archivo directamente si es necesario, 
      // pero por ahora seguiremos la lógica de subir y luego convertir.
      
      const uploadRes = await axios.post('http://localhost:8000/upload', formData);
      const fileName = uploadRes.data.filename;

      // 2. Solicitar conversión
      const convertRes = await axios.post(
        `http://localhost:8000/convert/pdf-to-word?file_name=${fileName}`, 
        null, 
        { responseType: 'blob' }
      );

      // 3. Descargar el archivo resultante
      const url = window.URL.createObjectURL(new Blob([convertRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName.replace('.pdf', '.docx'));
      document.body.appendChild(link);
      link.click();
      
      setSuccess(true);
    } catch (error) {
      console.error("Error en la conversión:", error);
      alert("Hubo un error al convertir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-8">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Volver al Inicio
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Conversor PDF a Word
          </h1>
          <p className="text-gray-400">Convierte tus documentos académicos manteniendo el diseño original.</p>
        </div>

        <div className="glass p-12 rounded-[2.5rem] border border-white/10 text-center">
          {!file ? (
            <label className="flex flex-col items-center gap-6 cursor-pointer group">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all duration-500">
                <Upload className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-semibold mb-2">Haz clic para subir un PDF</p>
                <p className="text-sm text-gray-500">Máximo 50MB</p>
              </div>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          ) : (
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <FileText className="w-8 h-8 text-blue-400" />
                <div className="text-left">
                  <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={() => {setFile(null); setSuccess(false);}} 
                  className="text-gray-500 hover:text-red-400 p-2"
                >
                  ✕
                </button>
              </div>

              {!success ? (
                <button 
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg flex items-center justify-center gap-3 glow disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" /> Convirtiendo...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" /> Convertir ahora
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4 animate-float">
                  <CheckCircle className="w-16 h-16 text-emerald-500" />
                  <p className="text-xl font-bold">¡Conversión lista!</p>
                  <button 
                    onClick={() => {setFile(null); setSuccess(false);}}
                    className="text-blue-400 hover:underline"
                  >
                    Convertir otro archivo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 rounded-3xl glass border border-white/5">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> Privacidad Total
            </h3>
            <p className="text-sm text-gray-500">Tus archivos se procesan localmente y se eliminan después de la conversión.</p>
          </div>
          <div className="p-6 rounded-3xl glass border border-white/5">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div> Formato Nativo
            </h3>
            <p className="text-sm text-gray-500">Generamos archivos .docx editables compatibles con Microsoft Word.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
