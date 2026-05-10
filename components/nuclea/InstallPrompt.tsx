"use client";

import { useState, useEffect } from "react";
import { X, Share } from "lucide-react";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detectar si es iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      !(window as Window & { MSStream?: unknown }).MSStream;
    
    // Detectar si ya está instalada (standalone)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (navigator as Navigator & { standalone?: boolean }).standalone 
      || (typeof document !== 'undefined' && document.referrer.includes('android-app://'));

    // Verificar si el usuario ya cerró el prompt antes
    const hasClosedPrompt = localStorage.getItem("nuclea-install-prompt-closed");

    if (isIOSDevice && !isStandaloneMode && !hasClosedPrompt) {
      setTimeout(() => setShowPrompt(true), 1000); // Dar un respiro a la carga inicial
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem("nuclea-install-prompt-closed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-foreground text-background rounded-3xl p-5 shadow-2xl relative overflow-hidden border border-white/10">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-background/40 hover:text-background transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-xl">✦</span>
          </div>
          <div className="flex-1 pr-6">
            <p className="font-sans font-semibold text-[14px] leading-tight mb-1">
              Instala Nuclea en tu iPhone
            </p>
            <p className="font-sans text-[12px] text-background/60 leading-relaxed">
              Toca <Share className="inline h-3 w-3 mx-0.5" /> y luego <span className="font-bold">&quot;Agregar a pantalla de inicio&quot;</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
