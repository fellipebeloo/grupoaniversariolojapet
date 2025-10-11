"use client";

import React, { useState, useEffect, useRef } from 'react';
import Hammer from 'hammerjs';
import { ChatHeader } from '@/components/ChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { ChatInput } from '@/components/ChatInput';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Message {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio';
  options?: string[];
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
  </div>
);

const FunnelPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', whatsapp: '' });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [topPull, setTopPull] = useState(0);
  const [bottomPull, setBottomPull] = useState(0);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 150;
      if (isScrolledToBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const mc = new Hammer(element);
    mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 5 });

    let isPanningBoundary = false;

    mc.on('panstart', (ev) => {
      const isAtTop = element.scrollTop < 5;
      const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;

      if ((isAtTop && ev.direction === Hammer.DIRECTION_DOWN) || (isAtBottom && ev.direction === Hammer.DIRECTION_UP)) {
        isPanningBoundary = true;
      } else {
        isPanningBoundary = false;
      }
    });

    mc.on('pan', (ev) => {
      if (!isPanningBoundary) return;
      
      ev.srcEvent.preventDefault();

      const isAtTop = element.scrollTop < 5;
      const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;
      
      if (isAtTop && ev.deltaY > 0) {
        const pullStrength = Math.min(ev.deltaY / 100, 1);
        setTopPull(pullStrength);
        setBottomPull(0);
      } else if (isAtBottom && ev.deltaY < 0) {
        const pullStrength = Math.min(Math.abs(ev.deltaY) / 100, 1);
        setBottomPull(pullStrength);
        setTopPull(0);
      } else {
        setTopPull(0);
        setBottomPull(0);
      }
    });

    mc.on('panend pancancel', () => {
      if (isPanningBoundary) {
        isPanningBoundary = false;
        setTopPull(0);
        setBottomPull(0);
      }
    });

    return () => {
      mc.destroy();
    };
  }, []);

  const addMessage = (sender: 'bot' | 'user', content: React.ReactNode, options?: string[]) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      remetente: sender === 'bot' ? 'Alessandra' : 'user',
      texto: content,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: 'texto',
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
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setStep(prev => prev + 1);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    if (step === 1) {
      setUserData(prev => ({ ...prev, name: inputValue }));
    }
    if (step === 2) {
      setUserData(prev => ({ ...prev, whatsapp: inputValue }));
    }
    handleNextStep(inputValue);
  };

  useEffect(() => {
    const runConversation = () => {
      switch (step) {
        case 0:
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage('bot', <>Oi! Eu sou a Alessandra do Time H.I.T.S. 👋<br/>Posso montar um plano personalizado pra você, mas antes…<br/>Como posso te chamar? 😊</>);
            setStep(1);
          }, 1000);
          break;
        case 2:
          addMessage('bot', `Perfeito, ${userData.name}! E me passa seu WhatsApp pra eu te enviar o mini-relatório?`);
          setShowInput(true);
          break;
        case 3:
          addMessage('bot', `Fechado! Agora me responde rapidinho: Quando você se olha no espelho… o que mais te incomoda hoje, ${userData.name}?`, ['A barriga / pochete que não some', 'Corpo sem firmeza', 'Inchaço e peso', 'Falta de energia']);
          break;
        case 4:
          addMessage('bot', 'Entendi, isso é mais comum do que parece... E me diz: o que você já tentou pra resolver isso?', ['Dietas malucas', 'Vídeos de treino do YouTube', 'Caminhada quando dá', 'Já tentei de tudo, sério']);
          break;
        case 5:
          addMessage('bot', `Agora seja sincera comigo, ${userData.name}... Quanto tempo você consegue tirar só pra você no dia?`, ['15 minutos', '20 a 30 minutos', 'Mais de 30, se for mágica', 'Quase nenhum tempo 😅']);
          break;
        case 6:
          addMessage('bot', 'E pra fechar: Se daqui 21 dias você se olhar no espelho, o que você quer ver?', ['Roupa servindo melhor', 'Barriga mais sequinha', 'Corpo mais firme', 'Meu sorriso de volta']);
          break;
        case 7:
          addMessage('bot', <>Arrasou, {userData.name}!<br/>Com base nas suas respostas, eu já consigo ver o que tá travando seu corpo.<br/><br/>Posso te mostrar o que é esse tal de Efeito Pochete Teimosa?</>, ['👉 Quero entender por que meu corpo trava']);
          break;
        default:
          break;
      }
    };
    runConversation();
  }, [step, userData.name]);

  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_auto] bg-[#0f1418] w-full">
      <ChatHeader />
      
      <div className="relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center pt-2 text-gray-500 transition-opacity duration-300 pointer-events-none z-10"
          style={{ opacity: topPull }}
        >
          <ArrowUp size={18} className="mr-2" />
          <span>Início da conversa</span>
        </div>

        <div ref={scrollContainerRef} className="overflow-y-auto overscroll-y-contain p-4 space-y-4 will-change-transform h-full">
          {messages.map(msg => (
            <MensagemBalao key={msg.id} {...msg} onOptionClick={handleNextStep} />
          ))}
          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <img
                src="/alessandra.jpg"
                alt="Alessandra"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="max-w-[80%] rounded-xl px-4 py-2 bg-[#202c33] rounded-bl-none shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 flex justify-center items-center pb-2 text-gray-500 transition-opacity duration-300 pointer-events-none z-10"
          style={{ opacity: bottomPull }}
        >
          <ArrowDown size={18} className="mr-2" />
          <span>Fim da conversa</span>
        </div>
      </div>

      <div className="p-4 bg-[#202c33] border-t border-gray-700">
        {showInput && (
          <ChatInput
            onSubmit={handleSubmit}
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            inputType={step === 2 ? 'tel' : 'text'}
            placeholder={step === 1 ? 'Digite seu nome...' : 'Digite seu WhatsApp...'}
          />
        )}
      </div>
    </div>
  );
};

export default FunnelPage;