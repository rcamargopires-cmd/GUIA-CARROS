
import React, { useState, useCallback, useEffect } from 'react';
import { QUESTIONS } from './constants';
import type { Answers, CarRecommendation } from './types';
import { getCarRecommendations, getCarRecommendationsFromAudio } from './services/geminiService';
import QuestionCard from './components/QuestionCard';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import VoiceSearch from './components/VoiceSearch';
import FavoritesDisplay from './components/FavoritesDisplay';
import ComparisonView from './components/ComparisonView';
import { BrandLogo } from './components/BrandLogo';
import { AdSpace } from './components/AdSpace';
import { HeartIcon } from './components/icons/HeartIcon';

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [favorites, setFavorites] = useState<CarRecommendation[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Estado para comparação
  const [comparisonList, setComparisonList] = useState<CarRecommendation[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Carregar favoritos do localStorage ao iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('carFavorites');
    if (savedFavorites) {
        try {
            setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
            console.error("Erro ao carregar favoritos", e);
        }
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('carFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Captura a localização ao iniciar o app
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Formata a localização para enviar à IA
          const loc = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
          setUserLocation(loc);
        },
        (error) => {
          console.warn("Geolocalização não permitida ou indisponível:", error);
          // Não bloqueamos o app, apenas seguimos sem a localização precisa
        }
      );
    }
  }, []);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const toggleFavorite = (car: CarRecommendation) => {
    setFavorites(prev => {
        const exists = prev.some(f => f.modelName === car.modelName);
        if (exists) {
            return prev.filter(f => f.modelName !== car.modelName);
        } else {
            return [...prev, car];
        }
    });
  };

  const toggleComparison = (car: CarRecommendation) => {
    setComparisonList(prev => {
        const exists = prev.some(c => c.modelName === car.modelName);
        if (exists) {
            return prev.filter(c => c.modelName !== car.modelName);
        } else {
            if (prev.length >= 3) return prev; // Limite máximo
            return [...prev, car];
        }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(false);
    try {
      const result = await getCarRecommendations(answers, userLocation);
      setRecommendations(result);
      setSearchPerformed(true);
    } catch (err) {
      setError('Desculpe, ocorreu um erro ao buscar as recomendações. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceCapture = async (base64Data: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(false);
    try {
      const result = await getCarRecommendationsFromAudio(base64Data, mimeType, userLocation);
      setRecommendations(result);
      setIsVoiceMode(false); // Exit voice mode to show results
      setSearchPerformed(true);
    } catch (err) {
        setError('Desculpe, não consegui entender o áudio ou encontrar recomendações. Tente novamente.');
        console.error(err);
        setIsVoiceMode(false); // Go back to error state
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRecommendations([]);
    setComparisonList([]); // Limpa comparação ao resetar
    setError(null);
    setIsLoading(false);
    setQuizStarted(false);
    setIsVoiceMode(false);
    setSearchPerformed(false);
    setShowFavorites(false);
  };
  
  const progressPercentage = quizStarted ? ((currentQuestionIndex + 1) / QUESTIONS.length) * 100 : 0;

  const renderContent = () => {
    if (showFavorites) {
        return (
            <FavoritesDisplay 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
                onBack={() => setShowFavorites(false)}
                comparisonList={comparisonList}
                onToggleComparison={toggleComparison} 
            />
        );
    }

    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/10 border border-red-500/20 rounded-xl animate-fade-in backdrop-blur-sm">
          <p className="text-red-400 mb-6 text-lg font-medium">{error}</p>
          <button
            onClick={handleReset}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Voltar ao Início
          </button>
        </div>
      );
    }
    
    // Caso a busca tenha sido feita, mas não retornou resultados (array vazio)
    if (searchPerformed && recommendations.length === 0) {
      return (
        <div className="text-center p-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-6 border border-slate-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Nenhum resultado encontrado</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Não conseguimos encontrar carros que correspondam exatamente a todos os seus critérios. Tente ajustar suas respostas ou aumentar o orçamento.
          </p>
          <button
            onClick={handleReset}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-sky-900/40 flex items-center gap-2 mx-auto transform hover:scale-105 uppercase tracking-wide text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Voltar ao Início
          </button>
        </div>
      );
    }

    if (recommendations.length > 0) {
      return (
        <ResultsDisplay 
            recommendations={recommendations} 
            onReset={handleReset} 
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            comparisonList={comparisonList}
            onToggleComparison={toggleComparison}
            onOpenComparison={() => setShowComparison(true)}
        />
      );
    }

    if (isVoiceMode) {
        return <VoiceSearch onAudioCapture={handleVoiceCapture} onCancel={() => setIsVoiceMode(false)} />;
    }
    
    if (quizStarted) {
      const currentQuestion = QUESTIONS[currentQuestionIndex];
      return (
        <div className="w-full">
           <div className="w-full bg-slate-700/50 rounded-full h-2 mb-8 backdrop-blur-sm">
                <div 
                    className="bg-sky-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" 
                    style={{width: `${progressPercentage}%`}}
                ></div>
            </div>
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
          <div className="mt-10 text-center">
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="bg-sky-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-sky-500 disabled:bg-slate-700/50 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 uppercase tracking-wide shadow-lg shadow-sky-900/30"
            >
              {currentQuestionIndex < QUESTIONS.length - 1 ? 'Próxima Pergunta' : 'Ver Recomendações'}
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center flex flex-col items-center animate-fade-in py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Encontre seu <span className="text-sky-400">Carro Ideal</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
          Responda algumas perguntas ou use sua voz para encontrar as melhores opções de seminovos, com estimativas de <strong>seguro</strong> e <strong>manutenção</strong>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
            <button
            onClick={() => setQuizStarted(true)}
            className="flex-1 bg-sky-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-sky-500 transition-all duration-300 text-lg transform hover:scale-105 shadow-lg shadow-sky-900/50 uppercase tracking-wide"
            >
            Começar Quiz
            </button>
            
            <button
            onClick={() => setIsVoiceMode(true)}
            className="flex-1 bg-slate-800 text-sky-400 border border-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-700 hover:border-sky-500/50 hover:text-sky-300 transition-all duration-300 text-lg flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-sky-300">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              Usar Voz
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-sky-500/30 selection:text-sky-200">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 pointer-events-none"></div>
        
        {/* Comparison Modal Overlay */}
        {showComparison && (
            <ComparisonView 
                cars={comparisonList} 
                onClose={() => setShowComparison(false)} 
                onRemove={toggleComparison}
            />
        )}

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen max-w-4xl">
            
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 animate-fade-in-down gap-4 relative">
                 {/* Botão de Favoritos (Absolute no mobile para ficar no topo, ou flex no desktop) */}
                 <div className="absolute right-0 top-0 md:static order-2 md:order-3">
                    {!showFavorites && !isLoading && (
                        <button 
                            onClick={() => setShowFavorites(true)}
                            className="relative group p-2 rounded-full bg-slate-800 border border-slate-700 hover:border-sky-500/50 transition-all"
                            title="Meus Favoritos"
                        >
                            <HeartIcon className={`w-6 h-6 transition-colors ${favorites.length > 0 ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`} filled={favorites.length > 0} />
                            {favorites.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
                                    {favorites.length}
                                </span>
                            )}
                        </button>
                    )}
                 </div>

                <div className="w-full flex justify-center md:absolute md:inset-x-0 md:pointer-events-none order-1 md:order-2">
                    <div onClick={handleReset} className="pointer-events-auto cursor-pointer">
                        <BrandLogo />
                    </div>
                </div>

                {/* Spacer para manter alinhamento no desktop */}
                <div className="hidden md:block w-10 order-1"></div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full">
                {renderContent()}
            </main>
            
            {/* Área de Propaganda Banner (Footer) */}
            <div className="w-full mt-16 animate-fade-in pb-20">
                <AdSpace variant="banner" />
            </div>

            <footer className="mt-8 text-center text-slate-500 text-sm animate-fade-in pb-4">
                <p>COPYRIGHT REINALDO RIBAS 2025</p>
            </footer>
        </div>
    </div>
  );
};

export default App;
