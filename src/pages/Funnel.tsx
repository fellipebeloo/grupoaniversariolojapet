"use client";

import React, { useState, useEffect, useRef } from 'react';
import Hammer from 'hammerjs';
import { Mic } from 'lucide-react';
import { ChatHeader } from '@/components/ChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { ChatInput } from '@/components/ChatInput';
import { AudioMessage } from '@/components/AudioMessage';
import { GroupChatView } from '@/components/GroupChatView';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';
import { PocheteTeimosaEffect } from '@/components/PocheteTeimosaEffect';

interface Message {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio' | 'custom-component';
  options?: string[];
}

const TypingIndicator = () => (
  <div className="typing-indicator flex items-center space-x-2">
    <span />
    <span />
    <span />
  </div>
);

const AudioRecordingIndicator = () => (
  <div className="flex items-center gap-2 text-green-400">
    <Mic size={18} className="animate-pulse" />
    <span className="text-sm">gravando áudio...</span>
  </div>
);

const FunnelPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', whatsapp: '' });
  const [inputValue, setInputValue] = useState('');
  const [typingIndicator, setTypingIndicator] = useState<'text' | 'audio' | null>(null);
  const [showInput, setShowInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pullTranslateY, setPullTranslateY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'group'>('chat');

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const mc = new Hammer(element);
    mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 5 });

    let panBoundary = false;

    mc.on('panstart', (ev) => {
      const isAtTop = element.scrollTop < 5;
      const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;

      if ((isAtTop && ev.direction === Hammer.DIRECTION_DOWN) || (isAtBottom && ev.direction === Hammer.DIRECTION_UP)) {
        panBoundary = true;
        setIsPanning(true);
      } else {
        panBoundary = false;
      }
    });

    mc.on('pan', (ev) => {
      if (!panBoundary) return;
      
      ev.srcEvent.preventDefault();

      const isAtTop = element.scrollTop < 5;
      const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;
      
      let translation = 0;
      if (isAtTop && ev.deltaY > 0) {
        translation = Math.pow(ev.deltaY, 0.8);
      } else if (isAtBottom && ev.deltaY < 0) {
        translation = -Math.pow(Math.abs(ev.deltaY), 0.8);
      }
      
      setPullTranslateY(translation);
    });

    mc.on('panend pancancel', () => {
      if (panBoundary) {
        panBoundary = false;
        setIsPanning(false);
        setPullTranslateY(0);
      }
    });

    return () => {
      mc.destroy();
    };
  }, [activeView]);

  const addMessage = (
    sender: 'bot' | 'user',
    content: React.ReactNode,
    options?: string[],
    type: Message['tipo'] = 'texto'
  ) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      remetente: sender === 'bot' ? 'Alessandra' : 'user',
      texto: content,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: type,
      options,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleNextStep = (userResponse: string) => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg => ({ ...msg, options: undefined }));
      const userMessage: Message = {
        id: (prevMessages.length + 1).toString(),
        remetente: 'user',
        texto: userResponse,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tipo: 'texto',
      };
      return [...updatedMessages, userMessage];
    });

    setInputValue('');
    setShowInput(false);

    const nextStep = step + 1;
    const audioSteps = [2, 6];

    if (audioSteps.includes(nextStep)) {
      setTypingIndicator('audio');
    } else {
      setTypingIndicator('text');
    }

    setTimeout(() => {
      if (!audioSteps.includes(nextStep)) {
        setTypingIndicator(null);
      }
      setStep(prev => prev + 1);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    if (step === 0) {
      setUserData(prev => ({ ...prev, name: inputValue }));
    }
    if (step === 1) {
      setUserData(prev => ({ ...prev, whatsapp: inputValue }));
    }
    handleNextStep(inputValue);
  };

  const handleBackFromGroup = () => {
    setActiveView('chat');
    setStep(9);
  };

  useEffect(() => {
    const runConversation = () => {
      switch (step) {
        case 0:
          if (messages.length === 0) {
            setTypingIndicator('text');
            setTimeout(() => {
              setTypingIndicator(null);
              addMessage('bot', <>Oi! Eu sou a Alessandra do Time H.I.T.S. 👋<br/>Posso montar um plano personalizado pra você, mas antes…<br/>Como posso te chamar? 😊</>);
              setShowInput(true);
            }, 1000);
          }
          break;
        case 1:
          addMessage('bot', `Perfeito, ${userData.name}! E me passa seu WhatsApp pra eu te enviar o mini-relatório?`);
          setShowInput(true);
          break;
        case 2:
          setTimeout(() => {
            setTypingIndicator(null);
            addMessage('bot', <AudioMessage />);
            setTimeout(() => {
              setTypingIndicator('text');
              setTimeout(() => {
                setTypingIndicator(null);
                addMessage('bot', `Fechado! Agora me responde rapidinho: Quando você se olha no espelho… o que mais te incomoda hoje, ${userData.name}?`, ['A barriga / pochete que não some', 'Corpo sem firmeza', 'Inchaço e peso', 'Falta de energia']);
              }, 1500);
            }, 2000);
          }, 1000);
          break;
        case 3:
          addMessage('bot', 'Entendi, isso é mais comum do que parece... E me diz: o que você já tentou pra resolver isso?', ['Dietas malucas', 'Vídeos de treino do YouTube', 'Caminhada quando dá', 'Já tentei de tudo, sério']);
          break;
        case 4:
          addMessage('bot', `Agora seja sincera comigo, ${userData.name}... Quanto tempo você consegue tirar só pra você no dia?`, ['15 minutos', '20 a 30 minutos', 'Mais de 30, se for mágica', 'Quase nenhum tempo 😅']);
          break;
        case 5:
          addMessage('bot', 'E pra fechar: Se daqui 21 dias você se olhar no espelho, o que você quer ver?', ['Roupa servindo melhor', 'Barriga mais sequinha', 'Corpo mais firme', 'Meu sorriso de volta']);
          break;
        case 6:
          setTimeout(() => {
            setTypingIndicator(null);
            addMessage('bot', <AudioMessage />);
            setTimeout(() => {
              setTypingIndicator('text');
              setTimeout(() => {
                setTypingIndicator(null);
                addMessage('bot', <>Arrasou, {userData.name}!<br/>Com base nas suas respostas, eu já consigo ver o que tá travando seu corpo.<br/><br/>Posso te mostrar o que é esse tal de Efeito Pochete Teimosa?</>, ['👉 Quero entender por que meu corpo trava']);
              }, 1500);
            }, 2000);
          }, 1000);
          break;
        case 7:
          const showMessages = async () => {
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', <>{userData.name}, antes de te explicar por que seu corpo tá travando, quero te mostrar algo...</>);

            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', 'Tem um grupo onde várias mulheres como você compartilham o que aconteceu depois que começaram a treinar comigo.');

            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', 'Olha só:');

            await new Promise(res => setTimeout(res, 800));
            addMessage(
              'bot', 
              <GroupInviteMessage onViewClick={() => setActiveView('group')} />, 
              undefined, 
              'custom-component'
            );
          };
          showMessages();
          break;
        case 9:
          setTypingIndicator('text');
          setTimeout(() => {
            setTypingIndicator(null);
            addMessage('bot', 'Viu só? Isso é o que acontece quando você destrava a queima de gordura do jeito certo. Pronta pra eu te mostrar como fazer isso?', ['Sim, me mostra!']);
          }, 1000);
          break;
        case 10:
          const showProblemMessages = async () => {
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', `${userData.name}, deixa eu te contar uma coisa que eu só descobri depois de MUITO erro e tentativa…`);

            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', 'Tem um motivo real pra sua barriga não ir embora, mesmo quando você se esforça.');

            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', <>É o que eu chamo de:<br/>💥 <strong>EFEITO POCHETE TEIMOSA</strong> 💥</>);

            await new Promise(res => setTimeout(res, 800));
            addMessage('bot', <PocheteTeimosaEffect />, undefined, 'custom-component');

            await new Promise(res => setTimeout(res, 2000));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', <>Esse efeito acontece quando o seu corpo entra num estado de auto-proteção:<br/><br/>Ele sente que tá sendo “atacado”<br/>Começa a segurar gordura (principalmente na barriga)<br/>E PARECE que nada funciona, mesmo com esforço</>);
            
            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', <>Sabe quando você treina, sua, se mata… e NADA muda?<br/><br/>É isso.<br/>Mas a culpa não é sua.</>);

            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', 'O problema tá no tipo de estímulo que seu corpo tá recebendo. Ele não foi ativado da forma certa.');

            await new Promise(res => setTimeout(res, 1200));
            setTypingIndicator('text');
            await new Promise(res => setTimeout(res, 1500));
            setTypingIndicator(null);
            addMessage('bot', 'Agora que você entendeu o vilão… Quer saber como eu quebro esse efeito nas minhas alunas?', ['SIM! Me mostra como destravar meu corpo']);
          };
          showProblemMessages();
          break;
        default:
          break;
      }
    };
    runConversation();
  }, [step, userData.name]);

  return (
    <>
      {activeView === 'chat' && (
        <div className="h-dvh grid grid-rows-[auto_1fr_auto] bg-[#0f1418] w-full">
          <ChatHeader />
          
          <div className="relative overflow-hidden">
            <div 
              ref={scrollContainerRef} 
              className="overflow-y-auto overscroll-y-contain p-4 space-y-4 will-change-transform h-full"
              style={{
                transform: `translateY(${pullTranslateY}px)`,
                transition: isPanning ? 'none' : 'transform 0.3s ease-out',
              }}
            >
              {messages.map(msg => {
                if (msg.tipo === 'custom-component') {
                  return <React.Fragment key={msg.id}>{msg.texto}</React.Fragment>;
                }
                return <MensagemBalao key={msg.id} {...msg} onOptionClick={handleNextStep} />;
              })}
              {typingIndicator && (
                <div className="flex items-end gap-2 justify-start">
                  <img
                    src="/alessandra.jpg"
                    alt="Alessandra"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="max-w-[80%] rounded-xl px-4 py-2 bg-[#202c33] rounded-bl-none shadow-sm">
                    {typingIndicator === 'text' ? <TypingIndicator /> : <AudioRecordingIndicator />}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 bg-[#202c33] border-t border-gray-700">
            {showInput && (
              <ChatInput
                onSubmit={handleSubmit}
                inputValue={inputValue}
                onInputChange={(e) => setInputValue(e.target.value)}
                inputType={step === 1 ? 'tel' : 'text'}
                placeholder={step === 0 ? 'Digite seu nome...' : 'Digite seu WhatsApp...'}
              />
            )}
          </div>
        </div>
      )}
      {activeView === 'group' && (
        <GroupChatView onBack={handleBackFromGroup} />
      )}
    </>
  );
};

export default FunnelPage;