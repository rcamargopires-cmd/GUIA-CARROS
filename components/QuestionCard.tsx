
import React from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, answer: string) => void;
  currentAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, currentAnswer }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold text-center mb-6 text-slate-200">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map(option => (
          <label
            key={option}
            className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
              currentAnswer === option
                ? 'bg-sky-500/20 border-sky-500'
                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={currentAnswer === option}
              onChange={() => onAnswer(question.id, option)}
              className="hidden"
            />
            <span className="flex-1 text-lg text-slate-200">{option}</span>
             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              currentAnswer === option ? 'border-sky-400 bg-sky-500' : 'border-slate-500 bg-slate-700'
            }`}>
              {currentAnswer === option && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
