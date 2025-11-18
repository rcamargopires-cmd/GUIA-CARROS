
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-t-4 border-slate-600 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-300 text-lg">Analisando suas respostas e buscando os melhores carros...</p>
    </div>
  );
};

export default LoadingSpinner;
