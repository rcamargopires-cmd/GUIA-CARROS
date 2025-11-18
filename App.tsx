
import React, { useState, useCallback } from 'react';
import { QUESTIONS } from './constants';
import type { Answers, CarRecommendation } from './types';
import { getCarRecommendations, getCarRecommendationsFromAudio } from './services/geminiService';
import QuestionCard from './components/QuestionCard';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { CarIcon } from './components/icons/CarIcon';
import VoiceSearch from './components/VoiceSearch';

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

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

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(false);
    try {
      const result = await getCarRecommendations(answers);
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
      const result = await getCarRecommendationsFromAudio(base64Data, mimeType);
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
    setError(null);
    setIsLoading(false);
    setQuizStarted(false);
    setIsVoiceMode(false);
    setSearchPerformed(false);
  };
  
  const progressPercentage = quizStarted ? ((currentQuestionIndex + 1) / QUESTIONS.length) * 100 : 0;

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/20 rounded-lg animate-fade-in">
          <p className="text-red-400 mb-6 text-lg">{error}</p>
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-full mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Nenhum resultado encontrado</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Não conseguimos encontrar carros que correspondam exatamente a todos os seus critérios. Tente ajustar suas respostas ou aumentar o orçamento.
          </p>
          <button
            onClick={handleReset}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-sky-900/40 flex items-center gap-2 mx-auto transform hover:scale-105"
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
      return <ResultsDisplay recommendations={recommendations} onReset={handleReset} />;
    }

    if (isVoiceMode) {
        return <VoiceSearch onAudioCapture={handleVoiceCapture} onCancel={() => setIsVoiceMode(false)} />;
    }
    
    if (quizStarted) {
      const currentQuestion = QUESTIONS[currentQuestionIndex];
      return (
        <div className="w-full">
           <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
                <div 
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{width: `${progressPercentage}%`}}
                ></div>
            </div>
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
          <div className="mt-8 text-center">
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {currentQuestionIndex < QUESTIONS.length - 1 ? 'Próxima Pergunta' : 'Ver Recomendações'}
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400 mb-4">Seu Guia de Carros Seminovos</h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10">
          Não sabe qual carro comprar? Responda algumas perguntas ou nos conte o que procura, e nossa IA encontrará as melhores opções para você.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
            <button
            onClick={() => setQuizStarted(true)}
            className="flex-1 bg-sky-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-sky-500 transition-all duration-300 text-lg transform hover:scale-105 shadow-lg shadow-sky-900/50"
            >
            Começar Quiz
            </button>
            
            <button
            onClick={() => setIsVoiceMode(true)}
            className="flex-1 bg-slate-700 text-sky-400 border border-slate-600 font-bold py-4 px-6 rounded-lg hover:bg-slate-600 hover:border-sky-500 hover:text-sky-300 transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            Falar o que procuro
            </button>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="mb-8 flex items-center gap-4">
          <CarIcon className="w-12 h-12 text-sky-500" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-200">Guia de Carros</h1>
        </header>
        <main className="w-full max-w-2xl bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700">
          {renderContent()}
        </main>
        <footer className="mt-8 text-slate-500 text-sm text-center">
          © {new Date().getFullYear()} Reinaldo Ribas. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default App;
