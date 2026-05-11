'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';
import { useState, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[500] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
                backdrop-blur-xl border-2 transition-all min-w-[320px] max-w-md
                ${t.type === 'success' ? 'bg-white/90 border-green-500/20 text-black' : 
                  t.type === 'error' ? 'bg-white/90 border-red-500/20 text-black' : 
                  'bg-white/90 border-yellow-500/20 text-black'}
              `}
            >
              <div className="flex-shrink-0">
                {t.type === 'success' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                {t.type === 'error' && <AlertCircle className="w-8 h-8 text-red-500" />}
                {t.type === 'warning' && <XCircle className="w-8 h-8 text-yellow-500" />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {t.type === 'success' ? 'Confirmación' : t.type === 'error' ? 'Atención' : 'Aviso'}
                </p>
                <p className="text-sm font-bold leading-tight">{t.message}</p>
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
