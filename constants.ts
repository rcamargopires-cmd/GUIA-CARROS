
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'budget',
    text: 'Qual é o seu orçamento aproximado?',
    options: ['Até R$ 40.000', 'R$ 40.001 - R$ 60.000', 'R$ 60.001 - R$ 80.000', 'Acima de R$ 80.000'],
  },
  {
    id: 'usage',
    text: 'Qual será o uso principal do carro?',
    options: ['Dia a dia na cidade', 'Viagens longas na estrada', 'Uso misto (cidade e estrada)', 'Trabalho (carga ou passageiros)'],
  },
  {
    id: 'transmission',
    text: 'Você prefere câmbio Automático ou Manual?',
    options: ['Automático', 'Manual', 'Tanto faz'],
  },
  {
    id: 'priority',
    text: 'O que você mais valoriza em um carro?',
    options: ['Economia de combustível', 'Desempenho e potência', 'Conforto e tecnologia', 'Espaço interno e porta-malas'],
  },
  {
    id: 'passengers',
    text: 'Quantas pessoas geralmente andarão no carro?',
    options: ['Apenas eu / casal', '3 a 4 pessoas', '5 pessoas', 'Mais de 5 pessoas'],
  },
  {
    id: 'bodyType',
    text: 'Qual seu tipo de carroceria preferido?',
    options: ['Hatch', 'Sedan', 'SUV', 'Picape ou Utilitário'],
  },
];