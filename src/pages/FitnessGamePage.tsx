import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

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

const FitnessGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || 'Guerreira';

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleOptionClick = (index: number) => {
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

  const handleGameComplete = () => {
    navigate('/funil?step=12');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0f1418] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-[#202c33] rounded-lg shadow-lg p-6">
        <div className="text-center font-bold text-2xl mb-2 text-green-400 flex items-center justify-center gap-2">
          <Gamepad2 size={28} />
          Jogo da Vida Fitness
        </div>
        <p className="text-center text-gray-400 mb-6">Suas Decisões Estão Travando Seu Corpo?</p>

        {gameState === 'intro' && (
          <div className="text-center p-4">
            <p className="mb-4">Olá, {userName}! Bora ver o quanto suas escolhas diárias tão te ajudando… ou te sabotando?</p>
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6">
              Começar o Jogo 🔥
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <p className="text-center font-semibold whitespace-pre-wrap mb-4 text-lg">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={feedback !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all
                    ${selectedOption === index ? (option.correct ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500') : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50'}
                    ${feedback !== null ? 'cursor-not-allowed' : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg text-center text-amber-300 italic">
                {feedback}
              </div>
            )}
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center p-4 space-y-4">
            <p className="font-semibold text-lg">{userName}, suas respostas mostraram o seguinte:</p>
            <p className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 font-bold">
              “Você tá repetindo o mesmo ciclo que trava o corpo de milhares de mulheres. Você tá dentro do Efeito Pochete Teimosa.”
            </p>
            <p className="text-gray-300">Mas calma… Agora que você sabe disso, eu posso te mostrar como destravar esse ciclo e fazer seu corpo responder rápido — do jeito certo.</p>
            <Button onClick={handleGameComplete} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full text-lg px-8 py-6">
              Me mostra o método H.I.T.S.
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessGamePage;