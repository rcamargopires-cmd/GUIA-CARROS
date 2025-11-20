
import React from 'react';
import type { CarRecommendation } from '../types';
import CarCard from './CarCard';
import { AdSpace } from './AdSpace';
import { CompareIcon } from './icons/CompareIcon';

interface ResultsDisplayProps {
  recommendations: CarRecommendation[];
  onReset: () => void;
  favorites: CarRecommendation[];
  onToggleFavorite: (car: CarRecommendation) => void;
  comparisonList: CarRecommendation[];
  onToggleComparison: (car: CarRecommendation) => void;
  onOpenComparison: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    recommendations, 
    onReset, 
    favorites, 
    onToggleFavorite,
    comparisonList,
    onToggleComparison,
    onOpenComparison
}) => {
  return (
    <div className="w-full animate-fade-in relative">
      <h2 className="text-3xl font-bold text-center mb-2 text-sky-400">Aqui estão suas recomendações!</h2>
      <p className="text-slate-400 text-center mb-8">Baseado em suas respostas, estes são os {recommendations.length} melhores carros para você:</p>
      
      <div className="space-y-6">
        {recommendations.map((car, index) => {
          const isFavorite = favorites.some(fav => fav.modelName === car.modelName);
          const isSelectedForComparison = comparisonList.some(c => c.modelName === car.modelName);
          
          return (
            <React.Fragment key={index}>
              <CarCard 
                car={car} 
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                isSelectedForComparison={isSelectedForComparison}
                onToggleComparison={onToggleComparison}
                disableComparison={!isSelectedForComparison && comparisonList.length >= 3}
              />
              
              {/* Inserir Propaganda após o 3º item (index 2) para alta visibilidade no feed */}
              {index === 2 && (
                <div className="py-2 animate-fade-in">
                   <AdSpace variant="card" className="border-sky-900/30 bg-sky-900/10" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-12 text-center pb-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-sky-900/40 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
          </svg>
          Reiniciar Pesquisa
        </button>
      </div>

      {/* Floating Action Bar for Comparison */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
            <div className="bg-slate-800/90 backdrop-blur-md border border-sky-500/50 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] p-2 pr-6 flex items-center gap-4">
                <div className="flex -space-x-2 pl-2">
                    {comparisonList.map((_, idx) => (
                        <div key={idx} className="w-8 h-8 rounded-full bg-sky-500 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white">
                            {idx + 1}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Comparar</span>
                    <span className="text-slate-400 text-xs">{comparisonList.length} de 3 selecionados</span>
                </div>
                <button 
                    onClick={onOpenComparison}
                    className="bg-sky-600 hover:bg-sky-500 text-white rounded-full p-2.5 shadow-lg transition-transform hover:scale-110"
                >
                    <CompareIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ResultsDisplay;
