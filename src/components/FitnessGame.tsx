import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Gamepad2 } from 'lucide-react';

const questions = [
  {
    question: "PERGUNTA 1: O DIA COMEÇOU…\nQual dessas foi sua manhã realista?",
    options: [
      { text: "Tomei café às pressas com pão e café", correct: false },
      { text: "Acordei tarde e pulei o café", correct: false },
      { text: "Comi ovo, frutas e bebi água antes de tudo", correct: true },
    ],
    feedback: "Pular café ou comer errado já manda seu corpo pro modo ‘sobrevivência’… e a barriga trava."
  },
  {
    question: "PERGUNTA 2: E O EXERCÍCIO HOJE?\nQual treino você fez?",
    options: [
      { text: "Assisti um vídeo de 50min no YouTube, mas não terminei", correct: false },
      { text: "Caminhei 10 minutos até o mercado", correct: false },
      { text: "Fiz um treino rápido, intenso e com sequência certa", correct: true },
    ],
    feedback: "Não é o tempo. É o tipo de estímulo. Treino errado = corpo travado."
  },
  {
    question: "PERGUNTA 3: NO TRABALHO OU CASA…\nComo foi sua energia durante o dia?",
    options: [
      { text: "Me senti cansada, meio arrastada", correct: false },
      { text: "Ok, mas fui me arrastando até a noite", correct: false },
      { text: "Tive picos de disposição depois de treinar", correct: true },
    ],
    feedback: "Corpo travado drena sua energia. Quando você destrava, até sua disposição muda."
  },
  {
    question: "PERGUNTA 4: FINAL DO DIA…\nO que rolou no fim da noite?",
    options: [
      { text: "Ataquei o doce ou pão sem pensar", correct: false },
      { text: "Fiquei sem fome e pulei a janta", correct: false },
      { text: "Fiz uma refeição leve com proteínas e água", correct: true },
    ],
    feedback: "O final do dia define se você vai secar ou estocar gordura. Cuidado."
  },
  {
    question: "PERGUNTA 5: E SUA AUTOIMAGEM HOJE?\nQuando se olhou no espelho…",
    options: [
      { text: "Desviei o olhar", correct: false },
      { text: "Me senti pesada e triste", correct: false },
      { text: "Notei melhoras e fiquei animada", correct: true },
    ],
    feedback: "Sua mente e corpo andam juntos. Se você não vê progresso, perde força. Bora virar esse jogo."
  }
];

interface FitnessGameProps {
  userName: string;
  onGameComplete: () => void;
}

export const FitnessGame = ({ userName, onGameComplete }: FitnessGameProps) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleOptionClick = (isCorrect: boolean, index: number) => {
    setSelectedOption(index);
    setFeedback(questions[currentQuestionIndex].feedback);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setFeedback(null);
        setSelectedOption(null);
      } else {
        setGameState('result');
      }
    }, 2500);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex items-end gap-2 justify-start">
      <img
        src="/alessandra.jpg"
        alt="Alessandra"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="max-w-[85%] w-full rounded-lg bg-[#202c33] text-gray-100 shadow-sm flex flex-col overflow-hidden p-3">
        <div className="text-center font-bold text-lg mb-2 text-green-400 flex items-center justify-center gap-2">
          <Gamepad2 size={24} />
          Jogo da Vida Fitness
        </div>
        <p className="text-center text-sm text-gray-400 mb-4">Suas Decisões Estão Travando Seu Corpo?</p>

        {gameState === 'intro' && (
          <div className="text-center p-4">
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white font-bold">
              Começar o Jogo 🔥
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <p className="text-center font-semibold whitespace-pre-wrap mb-4">{currentQuestion.question}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.correct, index)}
                  disabled={feedback !== null}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm
                    ${selectedOption === index ? (option.correct ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500') : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50'}
                    ${feedback !== null ? 'cursor-not-allowed' : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg text-center text-sm text-amber-300 italic">
                {feedback}
              </div>
            )}
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center p-4 space-y-4">
            <p className="font-semibold">{userName}, suas respostas mostraram o seguinte:</p>
            <p className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 font-bold">
              “Você tá repetindo o mesmo ciclo que trava o corpo de milhares de mulheres. Você tá dentro do Efeito Pochete Teimosa.”
            </p>
            <p>Mas calma… Agora que você sabe disso, eu posso te mostrar como destravar esse ciclo e fazer seu corpo responder rápido — do jeito certo.</p>
            <Button onClick={onGameComplete} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full">
              Me mostra o método H.I.T.S.
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};