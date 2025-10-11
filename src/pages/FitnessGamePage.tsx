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
    correctAudio: '/correct1.mp3', // Placeholder para áudio de resposta correta
    introAudioYawmm: '/yawmm.mp3', // Novo áudio de introdução
    introAudioConscienciaStart: '/consciencia-start.mp3' // Novo áudio de introdução
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
    correctAudio: '/correct2.mp3' // Placeholder para áudio de resposta correta
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
    correctAudio: '/correct3.mp3' // Placeholder para áudio de resposta correta
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
    correctAudio: '/correct4.mp3' // Placeholder para áudio de resposta correta
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
    correctAudio: '/correct5.mp3' // Placeholder para áudio de resposta correta
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
  const [introAudiosPlayedForQ1, setIntroAudiosPlayedForQ1] = useState(false);
  const [optionsDisabled, setOptionsDisabled] = useState(false); // Novo estado para desabilitar opções

  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const yawmmAudioRef = useRef<HTMLAudioElement | null>(null);
  const conscienciaStartAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmAudioRef.current = new Audio('/alarm.mp3');
    alarmAudioRef.current.loop = true;

    // Inicializa os áudios de introdução para a primeira pergunta
    if (questions[0].introAudioYawmm) {
      yawmmAudioRef.current = new Audio(questions[0].introAudioYawmm);
    }
    if (questions[0].introAudioConscienciaStart) {
      conscienciaStartAudioRef.current = new Audio(questions[0].introAudioConscienciaStart);
    }

    return () => {
      alarmAudioRef.current?.pause();
      if (alarmAudioRef.current) alarmAudioRef.current.currentTime = 0;
      if (currentVoiceAudioRef.current) {
        currentVoiceAudioRef.current.pause();
        currentVoiceAudioRef.current = null;
      }
      yawmmAudioRef.current?.pause();
      if (yawmmAudioRef.current) yawmmAudioRef.current.currentTime = 0;
      conscienciaStartAudioRef.current?.pause();
      if (conscienciaStartAudioRef.current) conscienciaStartAudioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && currentQuestionIndex === 0) {
      if (showAlarm) {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        alarmAudioRef.current?.play().catch(error => console.log("Alarm audio blocked by browser"));
      } else if (!introAudiosPlayedForQ1) { // Se o alarme foi dispensado e os áudios de intro não tocaram
        setOptionsDisabled(true); // Desabilita as opções
        const playIntroSequence = async () => {
          if (yawmmAudioRef.current) {
            await yawmmAudioRef.current.play().catch(error => console.log("Yawmm audio blocked:", error));
            await new Promise(resolve => {
              if (yawmmAudioRef.current) yawmmAudioRef.current.onended = resolve;
              else resolve(null);
            });
          }
          if (conscienciaStartAudioRef.current) {
            await conscienciaStartAudioRef.current.play().catch(error => console.log("Consciencia start audio blocked:", error));
            await new Promise(resolve => {
              if (conscienciaStartAudioRef.current) conscienciaStartAudioRef.current.onended = resolve;
              else resolve(null);
            });
          }
          setIntroAudiosPlayedForQ1(true);
          setOptionsDisabled(false); // Habilita as opções após os áudios
        };
        playIntroSequence();
      }
    }
  }, [gameState, currentQuestionIndex, showAlarm, introAudiosPlayedForQ1]);

  const handleDismissAlarm = () => {
    setShowAlarm(false);
    alarmAudioRef.current?.pause();
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
    }
    // O useEffect acima agora cuidará da reprodução dos áudios de introdução
  };

  const handleStart = () => {
    setGameState('playing');
    setIntroAudiosPlayedForQ1(false); // Reseta para permitir que os áudios de intro toquem novamente se o jogo for reiniciado
    setShowAlarm(true); // Reseta a visibilidade do alarme
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
                  disabled={feedback !== null || (currentQuestionIndex === 0 && optionsDisabled)} {/* Desabilita opções na Q1 enquanto intro audios tocam */}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all
                    ${selectedOption === index 
                      ? (option.correct ? 'bg-green-500/30 border-green-400' : 'bg-red-500/30 border-red-400') 
                      : 'bg-purple-800/50 border-purple-600 hover:bg-purple-700/50'}
                    ${feedback !== null || (currentQuestionIndex === 0 && optionsDisabled) ? 'cursor-not-allowed' : ''}`}
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