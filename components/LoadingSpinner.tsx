
import React, { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "LIGANDO OS MOTORES...",
    "ACELERANDO A BUSCA...",
    "VERIFICANDO HISTÓRICO...",
    "CALIBRANDO AS OFERTAS...",
    "POLINDO AS RECOMENDAÇÕES..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[400px] relative p-8 overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(14, 165, 233, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(14, 165, 233, 0.8)); }
        }

        .spinning-logo {
            animation: spin 2s linear infinite;
            transform-origin: center;
        }
        
        .logo-container {
            animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative w-32 h-32 mb-8 logo-container">
        <svg viewBox="0 0 100 100" className="w-full h-full spinning-logo">
          <defs>
            <linearGradient id="spinnerMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="spinnerSky" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          
          {/* Base do círculo / Pneu */}
          <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="url(#spinnerMetal)" strokeWidth="3" />
          
          {/* Detalhes internos (Raios) */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
          <path d="M50 5 L50 95" stroke="#334155" strokeWidth="1" />
          <path d="M5 50 L95 50" stroke="#334155" strokeWidth="1" />
          <path d="M18 18 L82 82" stroke="#334155" strokeWidth="1" opacity="0.5"/>
          <path d="M82 18 L18 82" stroke="#334155" strokeWidth="1" opacity="0.5"/>

          {/* Agulha da Bússola */}
          <g transform="rotate(-15 50 50)">
            <path d="M50 15 L60 50 L50 85 L40 50 Z" fill="#0f172a" />
            <path d="M50 15 L60 50 L50 50 Z" fill="url(#spinnerSky)" />
            <path d="M50 15 L40 50 L50 50 Z" fill="#0284c7" />
            <circle cx="50" cy="50" r="4" fill="white" />
          </g>
          
          {/* Arco decorativo externo */}
          <path d="M15 50 A 35 35 0 0 1 85 50" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
        </svg>
      </div>

      <div className="relative z-10 text-center space-y-2">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-500 animate-pulse tracking-wider">
            PROCESSANDO
        </h3>
        <p className="text-slate-400 text-sm font-medium">
            {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
