
import React from 'react';
import type { CarRecommendation } from '../types';
import CarCard from './CarCard';
import { AdSpace } from './AdSpace';

interface ResultsDisplayProps {
  recommendations: CarRecommendation[];
  onReset: () => void;
  favorites: CarRecommendation[];
  onToggleFavorite: (car: CarRecommendation) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ recommendations, onReset, favorites, onToggleFavorite }) => {
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-2 text-sky-400">Aqui estão suas recomendações!</h2>
      <p className="text-slate-400 text-center mb-8">Baseado em suas respostas, estes são os {recommendations.length} melhores carros para você:</p>
      
      <div className="space-y-6">
        {recommendations.map((car, index) => {
          const isFavorite = favorites.some(fav => fav.modelName === car.modelName);
          return (
            <React.Fragment key={index}>
              <CarCard 
                car={car} 
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
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
    </div>
  );
};

export default ResultsDisplay;
