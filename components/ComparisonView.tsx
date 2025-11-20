
import React from 'react';
import type { CarRecommendation } from '../types';
import { XIcon } from './icons/XIcon';
import { CheckIcon } from './icons/CheckIcon';
import { FuelIcon } from './icons/FuelIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { StarIcon } from './icons/StarIcon';

interface ComparisonViewProps {
  cars: CarRecommendation[];
  onClose: () => void;
  onRemove: (car: CarRecommendation) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ cars, onClose, onRemove }) => {
  if (cars.length === 0) return null;

  const renderStars = (rating: number) => (
    <div className="flex items-center justify-center gap-0.5">
      <span className="font-bold mr-1 text-slate-200">{rating}</span>
      <StarIcon className="w-4 h-4 text-yellow-400" filled />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div>
             <h2 className="text-2xl font-bold text-white">Comparativo Lado a Lado</h2>
             <p className="text-slate-400 text-sm">Analisando as diferenças entre os modelos selecionados</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="min-w-[800px] p-6">
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
              
              {/* Row: Headers / Models */}
              <div className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider flex items-end pb-6">
                Modelo
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-slate-800 flex flex-col relative group">
                  <button 
                    onClick={() => onRemove(car)}
                    className="absolute top-2 right-2 p-1 bg-slate-800 rounded-full text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover da comparação"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                  <h3 className="text-xl font-bold text-sky-400 mb-2">{car.modelName}</h3>
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-500/20 px-2 py-1 rounded w-fit">
                    {car.priceRange}
                  </div>
                </div>
              ))}

              {/* Row: Rating */}
              <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800 flex items-center">
                Avaliação do Dono
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 flex items-center justify-center">
                   {renderStars(car.consumerRating)}
                </div>
              ))}

              {/* Row: Consumption City */}
              <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800 flex items-center gap-2">
                <FuelIcon className="w-4 h-4" /> Consumo Cidade
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 text-slate-200 text-center">
                  {car.consumptionCity}
                </div>
              ))}

              {/* Row: Consumption Road */}
              <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800 flex items-center gap-2">
                <FuelIcon className="w-4 h-4" /> Consumo Estrada
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 text-slate-200 text-center">
                  {car.consumptionRoad}
                </div>
              ))}

              {/* Row: Insurance */}
              <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800 flex items-center gap-2">
                <ShieldIcon className="w-4 h-4" /> Seguro (Médio)
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 text-center font-medium text-purple-300">
                  {car.insuranceCost}
                </div>
              ))}

               {/* Row: Maintenance */}
               <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800 flex items-center gap-2">
                <WrenchIcon className="w-4 h-4" /> Manutenção
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 text-center font-medium text-orange-300">
                  {car.maintenanceCost}
                </div>
              ))}

              {/* Row: Pros */}
              <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800">
                Pontos Fortes
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 align-top">
                  <ul className="space-y-2">
                    {car.pros.map((pro, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-300">
                            <CheckIcon className="w-3 h-3 text-green-400 mr-1.5 mt-0.5 flex-shrink-0" />
                            {pro}
                        </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Row: Cons */}
              <div className="p-4 text-slate-400 font-semibold text-sm border-t border-slate-800">
                Pontos de Atenção
              </div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 align-top bg-red-900/5">
                  <ul className="space-y-2">
                    {car.cons.map((con, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-300">
                            <XIcon className="w-3 h-3 text-red-400 mr-1.5 mt-0.5 flex-shrink-0" />
                            {con}
                        </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Row: Action */}
              <div className="p-4 border-t border-slate-800"></div>
              {cars.map((car, idx) => (
                <div key={idx} className="p-4 border-l border-t border-slate-800 flex items-center justify-center">
                     <a 
                        href={`https://seminovos.abraorezeonline.com.br/estoque?palavra-chave=${encodeURIComponent(car.searchTerm)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors w-full text-center"
                    >
                        Ver Oferta
                    </a>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
