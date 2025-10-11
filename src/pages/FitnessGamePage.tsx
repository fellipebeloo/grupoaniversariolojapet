import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlarmNotification } from '@/components/AlarmNotification';

const questions = [
  {
    question: "PERGUNTA 1: O DIA COMEÇOU…\nQual dessas foi sua manhã realista?",
    options: [
      { text: "Tomei café às pressas com pão e café", correct: false },
      { text: "Acordei tarde e pulei o café", correct: false },
      { text: "Comi ovo, frutas e bebi água antes de tudo", correct: true },
    ],
    feedback: "Pular café ou comer errado já manda seu corpo pro modo ‘sobrevivência’… e a barriga trava.",
    audio: '/consciencia1.mp3',
    correctAudio: '/correct1.mp3'
  },
  {
    question: "PERGUNTA 2: E O EXERCÍCIO HOJE?\nQual treino você fez?",
    options: [
      { text: "Assisti um vídeo de 50min no YouTube, mas não terminei", correct: false },
      { text: "Caminhei 10 minutos até o mercado", correct: false },
      { text: "Fiz um treino rápido, intenso e com sequência certa", correct: true },
    ],
    feedback: "Não é o tempo. É o tipo de estímulo. Treino errado = corpo travado.",
    audio: '/consciencia2.mp3',
    correctAudio: '/correct2.mp3'
  },
  {
    question: "PERGUNTA 3: NO TRABALHO OU CASA…\nComo foi sua energia durante o dia?",
    options: [
      { text: "Me senti cansada, meio arrastada", correct: false },
      { text: "Ok, mas fui me arrastando até a noite", correct: false },
      { text: "Tive picos de disposição depois de treinar", correct: true },
    ],
    feedback: "Corpo travado drena sua energia. Quando você destrava, até sua disposição muda.",
    audio: '/consciencia3.mp3',
    correctAudio: '/correct3.mp3'
  },
  {
    question: "PERGUNTA 4: FINAL DO DIA…\nO que rolou no fim da noite?",
    options: [
      { text: "Ataquei o doce ou pão sem pensar", correct: false },
      { text: "Fiquei sem fome e pulei a janta", correct: false },
      { text: "Fiz uma refeição leve com proteínas e água", correct: true },
    ],
    feedback: "O final do dia define se você vai secar ou estocar gordura. Cuidado.",
    audio: '/consciencia4.mp3',
    correctAudio: '/correct4..mp3'
  },
  {
    question: "PERGUNTA 5: E SUA AUTOIMAGEM HOJE?\nQuando se olhou no espelho…",
    options: [
      { text: "Desviei o olhar", correct: false },
      { text: "Me senti pesada e triste", correct: false },
      { text: "Notei melhoras e fiquei animada", correct: true },
    ],
    feedback: "Sua mente e corpo andam juntos. Se você não vê progresso, perde força. Bora virar esse jogo.",
    audio: '/consciencia5.mp3',
    correctAudio: '/correct5.mp3'
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
  const [showAlarm, setShowAlarm] = useState(true);

  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const yawnAudioRef = useRef<HTMLAudioElement | null>(null);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmAudioRef.current = new Audio('/alarm.mp3');
    alarmAudioRef.current.loop = true;
    yawnAudioRef.current = new Audio('/yaaaam.mp3');
    introAudioRef.current = new Audio('/intro-consciencia.mp3');

    return () => {
      alarmAudioRef.current?.pause();
      yawnAudioRef.current?.pause();
      introAudioRef.current?.pause();
      if (currentVoiceAudioRef.current) {
        currentVoiceAudioRef.current.pause();
        currentVoiceAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && currentQuestionIndex === 0 && showAlarm) {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      alarmAudioRef.current?.play().catch(error => console.log("Alarm audio blocked by browser"));
    }
  }, [gameState, currentQuestionIndex, showAlarm]);

  const handleDismissAlarm = () => {
    setShowAlarm(false);
    alarmAudioRef.current?.pause();
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
    }

    const yawnSound = yawnAudioRef.current;
    const introSound = introAudioRef.current;

    if (yawnSound) {
      yawnSound.play().catch(error => console.log("Yawn audio blocked:", error));
      yawnSound.onended = () => {
        if (introSound) {
          introSound.play().catch(error => console.log("Intro audio blocked:", error));
        }
      };
    }
  };

  const handleStart = () => {
    setGameState('playing');
  };

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setFeedback(questions[currentQuestionIndex].feedback);

    if (currentVoiceAudioRef.current) {
      currentVoiceAudioRef.current.pause();
      currentVoiceAudioRef.current.currentTime = 0;
    }

    const isCorrect = questions[currentQuestionIndex].options[index].correct;
    let audioPathToPlay: string | undefined;

    if (isCorrect) {
      audioPathToPlay = questions[currentQuestionIndex].correctAudio;
    } else {
      audioPathToPlay = questions[currentQuestionIndex].audio;
    }
    
    if (audioPathToPlay) {
      currentVoiceAudioRef.current = new Audio(audioPathToPlay);
      currentVoiceAudioRef.current.play().catch(error => console.log("Voice audio blocked by browser:", error));
    }

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
    <div 
      className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative bg-cover bg-center"
      style={{ backgroundImage: `url('/game-background.jpg')` }}
    >
      {gameState === 'playing' && currentQuestionIndex === 0 && showAlarm && (
        <div className="absolute top-8 left-0 right-0 px-4">
          <AlarmNotification onDismiss={handleDismissAlarm} />
        </div>
      )}

      <div className="w-full max-w-md mx-auto bg-purple-900/70 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-700">
        <div className="text-center font-bold text-2xl mb-2 text-yellow-300 flex items-center justify-center gap-2">
          <Gamepad2 size={28} />
          Jogo da Vida Fitness
        </div>
        <p className="text-center text-purple-200 mb-6">Suas Decisões Estão Travando Seu Corpo?</p>

        {gameState === 'intro' && (
          <div className="text-center p-4">
            <p className="mb-4 text-purple-100">Olá, {userName}! Bora ver o quanto suas escolhas diárias tão te ajudando… ou te sabotando?</p>
            <Button onClick={handleStart} className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold text-lg px-8 py-6">
              Começar o Jogo 🔥
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <p className="text-center font-semibold whitespace-pre-wrap mb-4 text-lg text-purple-100">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={feedback !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all
                    ${selectedOption === index 
                      ? (option.correct ? 'bg-green-500/30 border-green-400' : 'bg-red-500/30 border-red-400') 
                      : 'bg-purple-800/50 border-purple-600 hover:bg-purple-700/50'}
                    ${feedback !== null ? 'cursor-not-allowed' : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="mt-4 p-3 bg-purple-950/50 rounded-lg text-center text-yellow-300 italic border border-purple-700">
                {feedback}
              </div>
            )}
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center p-4 space-y-4">
            <p className="font-semibold text-lg text-purple-100">{userName}, suas respostas mostraram o seguinte:</p>
            <p className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 font-bold">
              “Você tá repetindo o mesmo ciclo que trava o corpo de milhares de mulheres. Você tá dentro do Efeito Pochete Teimosa.”
            </p>
            <p className="text-purple-200">Mas calma… Agora que você sabe disso, eu posso te mostrar como destravar esse ciclo e fazer seu corpo responder rápido — do jeito certo.</p>
            <Button onClick={handleGameComplete} className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold w-full text-lg px-8 py-6">
              Me mostra o método H.I.T.S.
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessGamePage;