
import React from 'react';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Ícone da Bússola/Roda */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
        {/* Anel Externo (Pneu/Aro) */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]">
          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          
          {/* Base do círculo */}
          <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="url(#metalGradient)" strokeWidth="3" />
          
          {/* Detalhes internos (Raios) */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
          <path d="M50 5 L50 95" stroke="#334155" strokeWidth="1" />
          <path d="M5 50 L95 50" stroke="#334155" strokeWidth="1" />
          <path d="M18 18 L82 82" stroke="#334155" strokeWidth="1" opacity="0.5"/>
          <path d="M82 18 L18 82" stroke="#334155" strokeWidth="1" opacity="0.5"/>

          {/* Agulha da Bússola (Estilo Carro) */}
          <g transform="rotate(-15 50 50)">
            <path d="M50 15 L60 50 L50 85 L40 50 Z" fill="#0f172a" />
            <path d="M50 15 L60 50 L50 50 Z" fill="url(#skyGradient)" />
            <path d="M50 15 L40 50 L50 50 Z" fill="#0284c7" />
            <circle cx="50" cy="50" r="4" fill="white" />
          </g>
          
          {/* Arco decorativo externo */}
          <path d="M15 50 A 35 35 0 0 1 85 50" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
        </svg>
      </div>
      
      {/* Texto do Logo */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-none">
          GUIA <span className="text-sky-400">de</span> CARROS
        </h1>
        <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-slate-400 uppercase mt-1 block">
          Seminovos
        </span>
      </div>
    </div>
  );
};
