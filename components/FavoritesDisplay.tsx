
import React from 'react';
import type { CarRecommendation } from '../types';
import CarCard from './CarCard';
import { HeartIcon } from './icons/HeartIcon';

interface FavoritesDisplayProps {
  favorites: CarRecommendation[];
  onToggleFavorite: (car: CarRecommendation) => void;
  onBack: () => void;
}

const FavoritesDisplay: React.FC<FavoritesDisplayProps> = ({ favorites, onToggleFavorite, onBack }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Voltar
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-sky-400 flex items-center gap-3">
            <HeartIcon className="w-8 h-8 text-red-500" filled />
            Meus Favoritos
        </h2>
        <div className="w-20"></div> {/* Spacer para centralizar visualmente o título */}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center p-12 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-6">
             <HeartIcon className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">Sua lista está vazia</h3>
          <p className="text-slate-400 mb-6">Você ainda não salvou nenhum carro. Faça uma busca e clique no coração para salvar.</p>
          <button
            onClick={onBack}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
          >
            Encontrar Carros
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((car, index) => (
            <CarCard 
                key={index} 
                car={car} 
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(car)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesDisplay;
