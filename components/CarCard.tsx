
import React, { useState } from 'react';
import type { CarRecommendation } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { FuelIcon } from './icons/FuelIcon';
import { StarIcon } from './icons/StarIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CompareIcon } from './icons/CompareIcon';
import { CarIcon } from './icons/CarIcon';

interface CarCardProps {
  car: CarRecommendation;
  isFavorite?: boolean;
  onToggleFavorite?: (car: CarRecommendation) => void;
  isSelectedForComparison?: boolean;
  onToggleComparison?: (car: CarRecommendation) => void;
  disableComparison?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ 
    car, 
    isFavorite = false, 
    onToggleFavorite,
    isSelectedForComparison = false,
    onToggleComparison,
    disableComparison = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showVersionDiffs, setShowVersionDiffs] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Gera uma URL de busca de imagem focada em estúdio e fundo escuro
  // "studio shot black background" remove ambientes de loja e placas
  const imageUrl = `https://tse4.mm.bing.net/th?q=${encodeURIComponent(car.modelName + " black car studio shot wallpaper 4k")}&w=700&h=400&c=7&rs=1&p=0`;

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
        onToggleFavorite(car);
    }
  };

  const handleComparisonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComparison) {
        onToggleComparison(car);
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `https://seminovos.abraorezeonline.com.br/estoque?palavra-chave=${encodeURIComponent(car.searchTerm)}`;
    const shareData = {
        title: `Confira este ${car.modelName}`,
        text: `Encontrei este ${car.modelName} que parece ideal. O que acha?`,
        url: shareUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowCopiedToast(true);
            setTimeout(() => setShowCopiedToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1" title={`Nota dos consumidores: ${rating}/5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star} 
            className={`w-4 h-4 ${
              rating >= star 
                ? 'text-yellow-400' 
                : rating >= star - 0.5 
                  ? 'text-yellow-400' 
                  : 'text-slate-600'
            }`} 
            filled={rating >= star}
            half={rating < star && rating >= star - 0.5}
          />
        ))}
        <span className="text-slate-400 text-xs font-medium ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className={`
        rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col relative group/card
        ${isSelectedForComparison 
            ? 'bg-slate-800 border-2 border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)]' 
            : 'bg-slate-800 border border-slate-700 hover:border-sky-500/50 hover:shadow-sky-900/40'}
    `}>
      
      {/* Image Section */}
      <div className="relative w-full h-48 md:h-60 overflow-hidden bg-slate-950">
        {!imgError ? (
            <img 
                src={imageUrl} 
                alt={car.modelName} 
                className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700 brightness-[0.65] contrast-110"
                onError={() => setImgError(true)}
                loading="lazy"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <CarIcon className="w-16 h-16 text-slate-700" />
            </div>
        )}
        
        {/* Gradient Overlay for Text readability and aesthetics - Stronger dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90"></div>

        {/* Floating Action Buttons over Image */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
             {/* Compare Button */}
             {onToggleComparison && (
                <button
                    onClick={handleComparisonClick}
                    disabled={!isSelectedForComparison && disableComparison}
                    className={`
                        p-2 rounded-full transition-colors relative group/compare backdrop-blur-sm
                        ${isSelectedForComparison 
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' 
                            : disableComparison
                                ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-700'
                                : 'bg-slate-900/60 text-slate-300 hover:bg-sky-600 hover:text-white border border-slate-700/50'
                        }
                    `}
                    title={isSelectedForComparison ? "Remover da comparação" : disableComparison ? "Limite de comparação atingido" : "Comparar"}
                >
                    <CompareIcon className="w-5 h-5" />
                </button>
            )}

            {/* Share Button */}
            <div className="relative">
                <button 
                    onClick={handleShareClick}
                    className="p-2 rounded-full bg-slate-900/60 backdrop-blur-sm hover:bg-sky-600 border border-slate-700/50 transition-colors text-slate-300 hover:text-white"
                    title="Compartilhar"
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
                {/* Toast Notification for Copy */}
                {showCopiedToast && (
                    <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-sky-600 text-white text-xs rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                        Link Copiado!
                    </div>
                )}
            </div>

            {/* Favorite Button */}
            {onToggleFavorite && (
                <button 
                    onClick={handleFavoriteClick}
                    className="p-2 rounded-full bg-slate-900/60 backdrop-blur-sm hover:bg-slate-800 border border-slate-700/50 transition-colors"
                    title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <HeartIcon 
                        className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'text-red-500 scale-110' : 'text-slate-300 hover:text-red-400'}`} 
                        filled={isFavorite} 
                    />
                </button>
            )}
        </div>

        {/* Price Badge on Image */}
        <div className="absolute bottom-4 right-4 max-w-[80%] text-right">
             <div className="inline-flex flex-col items-end bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 rounded-lg px-3 py-1.5 shadow-lg">
                <span className="text-emerald-400 font-bold text-sm md:text-base whitespace-nowrap">
                   {car.priceRange}
                </span>
                <span className="text-[10px] text-emerald-500/80 font-medium border-t border-emerald-500/20 pt-0.5 mt-0.5">
                   {car.priceReference}
                </span>
             </div>
        </div>
      </div>

      <div className="p-6 flex flex-col pt-4">
        {/* Header Section (Always Visible & Clickable) */}
        <div 
          onClick={toggleDetails}
          className="flex flex-col gap-1 mb-4 cursor-pointer group"
        >
             <div className="flex items-center justify-between gap-2">
                <h3 className="text-2xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors leading-tight">{car.modelName}</h3>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`text-slate-500 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''} flex-shrink-0`}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
             </div>
             {/* Consumer Rating Display */}
             <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Opinião do Dono:</span>
                {renderStars(car.consumerRating || 0)}
             </div>
        </div>

        {/* Summary (Always Visible) */}
        <p className="text-slate-300 mb-6 leading-relaxed text-sm md:text-base">{car.summary}</p>

        {/* Toggle Button */}
        <button
            onClick={toggleDetails}
            className="mb-6 w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-700/30 hover:bg-slate-700/50 text-sky-400 rounded-lg transition-colors border border-slate-600/50 border-dashed hover:border-solid"
        >
            <span className="font-semibold text-sm">{showDetails ? 'Ocultar Detalhes' : 'Ver Custos, Consumo e Detalhes'}</span>
        </button>

        {/* Expandable Details Section */}
        {showDetails && (
            <div className="animate-fade-in">
                
                {/* Specs Grid: Consumption & Costs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Consumption Row */}
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex items-center gap-3">
                        <div className="p-2 bg-sky-900/30 rounded-full text-sky-400">
                            <FuelIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Consumo Cidade</p>
                            <p className="text-slate-200 font-medium text-sm">{car.consumptionCity}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex items-center gap-3">
                        <div className="p-2 bg-sky-900/30 rounded-full text-sky-400">
                            <FuelIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Consumo Estrada</p>
                            <p className="text-slate-200 font-medium text-sm">{car.consumptionRoad}</p>
                        </div>
                    </div>

                    {/* Costs Row */}
                     <div className="bg-slate-900/50 p-3 rounded-lg border border-purple-500/20 flex items-center gap-3 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-1 bg-purple-500/50"></div>
                        <div className="p-2 bg-purple-900/30 rounded-full text-purple-400">
                            <ShieldIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Seguro Médio</p>
                            <p className="text-slate-200 font-medium text-sm">{car.insuranceCost}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-orange-500/20 flex items-center gap-3 relative overflow-hidden">
                         <div className="absolute inset-y-0 left-0 w-1 bg-orange-500/50"></div>
                        <div className="p-2 bg-orange-900/30 rounded-full text-orange-400">
                            <WrenchIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Manutenção</p>
                            <p className="text-slate-200 font-medium text-sm">{car.maintenanceCost}</p>
                        </div>
                    </div>
                </div>

                {/* Versions and Differences Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => setShowVersionDiffs(!showVersionDiffs)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                            showVersionDiffs 
                            ? 'bg-slate-700 border-sky-500/50' 
                            : 'bg-slate-800 border-slate-600 hover:border-slate-500 hover:bg-slate-750'
                        }`}
                    >
                         <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${showVersionDiffs ? 'bg-sky-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </div>
                            <span className="font-semibold text-slate-200 text-sm">Comparar Versões</span>
                         </div>
                         <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="18" 
                            height="18" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className={`text-slate-400 transition-transform ${showVersionDiffs ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    
                    {showVersionDiffs && (
                        <div className="mt-3 space-y-3 animate-fade-in pl-2 border-l-2 border-slate-700">
                            {car.versions.map((version, idx) => (
                                <div key={idx} className="bg-slate-700/30 p-3 rounded-lg border border-slate-700">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                        <h5 className="font-bold text-sky-200 text-sm">{version.name}</h5>
                                    </div>
                                    <p className="text-xs md:text-sm text-slate-300 pl-4">{version.features}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 className="font-semibold text-sm text-green-400 mb-3 flex items-center gap-2">
                        Pontos Positivos
                        </h4>
                        <ul className="space-y-2">
                        {car.pros.map((pro, index) => (
                            <li key={index} className="flex items-start p-2 rounded bg-green-900/10 border border-green-900/20">
                            <CheckIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-xs md:text-sm">{pro}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-red-400 mb-3 flex items-center gap-2">
                        Pontos de Atenção
                        </h4>
                        <ul className="space-y-2">
                        {car.cons.map((con, index) => (
                            <li key={index} className="flex items-start p-2 rounded bg-red-900/10 border border-red-900/20">
                            <XIcon className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-xs md:text-sm">{con}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        )}
        
        {/* Action Button (Always Visible) */}
        <div className="mt-auto pt-4 border-t border-slate-700">
           <a 
             href={`https://seminovos.abraorezeonline.com.br/estoque?palavra-chave=${encodeURIComponent(car.searchTerm)}`}
             target="_blank"
             rel="noopener noreferrer"
             className="block w-full bg-sky-600 hover:bg-sky-500 text-white text-center font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-sky-900/20 flex items-center justify-center gap-2 text-lg"
           >
             <span>Ver Ofertas na Loja</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
               <polyline points="15 3 21 3 21 9"></polyline>
               <line x1="10" y1="14" x2="21" y2="3"></line>
             </svg>
           </a>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
