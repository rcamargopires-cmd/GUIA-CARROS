
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
        @keyframes neon-glow {
          0%, 100% { filter: drop-shadow(0 0 2px #0ea5e9) drop-shadow(0 0 5px #0ea5e9); }
          50% { filter: drop-shadow(0 0 5px #0ea5e9) drop-shadow(0 0 15px #0ea5e9); }
        }
        
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes road-dash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -40; }
        }
        
        @keyframes car-suspension {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-1px); }
          50% { transform: translateY(1px); }
          75% { transform: translateY(-1px); }
        }

        @keyframes speed-line {
           0% { transform: translateX(100%); opacity: 0; }
           20% { opacity: 1; }
           100% { transform: translateX(-100%); opacity: 0; }
        }

        .neon-car-group {
            animation: car-suspension 1s ease-in-out infinite;
        }
        
        .car-path {
            stroke: #38bdf8;
            stroke-width: 2;
            fill: rgba(15, 23, 42, 0.6);
            animation: neon-glow 2s infinite alternate;
        }

        .wheel-rim {
            stroke: #0ea5e9;
            stroke-width: 2;
            fill: #0f172a;
            transform-box: fill-box;
            transform-origin: center;
            animation: wheel-spin 0.5s linear infinite;
        }

        .road-line {
            stroke: #64748b;
            stroke-width: 3;
            stroke-dasharray: 20 20;
            animation: road-dash 0.5s linear infinite;
        }
      `}</style>

      <div className="relative w-full max-w-[360px] h-[180px] flex items-center justify-center mb-4">
        <svg width="100%" height="100%" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            <defs>
                <linearGradient id="headlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                    <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                </linearGradient>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(15, 23, 42, 0)" />
                    <stop offset="100%" stopColor="rgba(14, 165, 233, 0.1)" />
                </linearGradient>
            </defs>

            {/* Background Grid Effect (Floor) */}
            <path d="M0 140 L360 140 L300 180 L60 180 Z" fill="url(#bgGradient)" />

            {/* Road */}
            <line x1="-20" y1="140" x2="380" y2="140" stroke="#1e293b" strokeWidth="4" />
            <line x1="0" y1="140" x2="360" y2="140" className="road-line" />

            {/* Speed Lines (Background) */}
            <g opacity="0.3">
                <rect x="0" y="40" width="60" height="2" fill="#38bdf8" rx="1" style={{animation: 'speed-line 1.5s linear infinite 0.1s'}} />
                <rect x="0" y="90" width="100" height="2" fill="#38bdf8" rx="1" style={{animation: 'speed-line 1.2s linear infinite 0.5s'}} />
                <rect x="0" y="20" width="40" height="2" fill="#38bdf8" rx="1" style={{animation: 'speed-line 2s linear infinite 1.2s'}} />
            </g>

            {/* Car Group */}
            <g className="neon-car-group" transform="translate(60, 60)">
                
                {/* Headlight Beam */}
                <path d="M190 55 L320 40 L320 90 L190 65" fill="url(#headlightGradient)" opacity="0.3" />

                {/* Car Body */}
                {/* Coordinates for a sporty SUV shape */}
                <path 
                    className="car-path"
                    d="M 10 55 
                       L 15 40 
                       L 50 32 
                       L 80 15 
                       L 150 15 
                       L 180 35 
                       L 195 40 
                       L 195 60 
                       L 190 70 
                       L 170 70 
                       A 17 17 0 0 1 136 70 
                       L 74 70 
                       A 17 17 0 0 1 40 70 
                       L 15 70 
                       L 10 55 Z"
                    strokeLinejoin="round"
                />
                
                {/* Window Line Details */}
                <path d="M 82 18 L 148 18 L 175 35 L 52 35 Z" fill="rgba(56, 189, 248, 0.2)" stroke="none" />
                <path d="M 82 18 L 52 35 L 175 35" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.7" />

                {/* Wheels */}
                <g className="wheel-rim" transform="translate(57, 70)">
                    <circle cx="0" cy="0" r="14" stroke="none" fill="#0f172a" /> 
                    <circle cx="0" cy="0" r="12" fill="none" />
                    <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                    <line x1="0" y1="-12" x2="0" y2="12" />
                    <line x1="-12" y1="0" x2="12" y2="0" />
                </g>

                <g className="wheel-rim" transform="translate(153, 70)">
                    <circle cx="0" cy="0" r="14" stroke="none" fill="#0f172a" />
                    <circle cx="0" cy="0" r="12" fill="none" />
                    <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                    <line x1="0" y1="-12" x2="0" y2="12" />
                    <line x1="-12" y1="0" x2="12" y2="0" />
                </g>
            </g>
            
             {/* Speed Lines (Foreground) */}
            <g opacity="0.6">
                 <rect x="0" y="110" width="80" height="2" fill="#38bdf8" rx="1" style={{animation: 'speed-line 0.8s linear infinite 0.3s'}} />
            </g>

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
