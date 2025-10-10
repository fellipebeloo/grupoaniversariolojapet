"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChatHeader } from '@/components/ChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { ChatInput } from '@/components/ChatInput';

interface Message {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio';
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
  const [showOptions, setShowOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const addMessage = (sender: 'bot' | 'user', content: React.ReactNode) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      remetente: sender === 'bot' ? 'Alessandra' : 'user',
      texto: content,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: 'texto',
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleNextStep = (userResponse: string) => {
    addMessage('user', userResponse);
    setInputValue('');
    setShowInput(false);
    setShowOptions([]);
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
          addMessage('bot', `Fechado! Agora me responde rapidinho: Quando você se olha no espelho… o que mais te incomoda hoje, ${userData.name}?`);
          setShowOptions(['A barriga / pochete que não some', 'Corpo sem firmeza', 'Inchaço e peso', 'Falta de energia']);
          break;
        case 4:
          addMessage('bot', 'Entendi, isso é mais comum do que parece... E me diz: o que você já tentou pra resolver isso?');
          setShowOptions(['Dietas malucas', 'Vídeos de treino do YouTube', 'Caminhada quando dá', 'Já tentei de tudo, sério']);
          break;
        case 5:
          addMessage('bot', `Agora seja sincera comigo, ${userData.name}... Quanto tempo você consegue tirar só pra você no dia?`);
          setShowOptions(['15 minutos', '20 a 30 minutos', 'Mais de 30, se for mágica', 'Quase nenhum tempo 😅']);
          break;
        case 6:
          addMessage('bot', 'E pra fechar: Se daqui 21 dias você se olhar no espelho, o que você quer ver?');
          setShowOptions(['Roupa servindo melhor', 'Barriga mais sequinha', 'Corpo mais firme', 'Meu sorriso de volta']);
          break;
        case 7:
          addMessage('bot', <>Arrasou, {userData.name}!<br/>Com base nas suas respostas, eu já consigo ver o que tá travando seu corpo.<br/><br/>Posso te mostrar o que é esse tal de Efeito Pochete Teimosa?</>);
          setShowOptions(['👉 Quero entender por que meu corpo trava']);
          break;
        default:
          break;
      }
    };
    runConversation();
  }, [step, userData.name]);

  return (
    <div className="h-screen flex flex-col bg-[#f5f6f6] dark:bg-gray-950 w-full">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MensagemBalao key={msg.id} {...msg} />
        ))}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <img
              src="/alessandra.jpg"
              alt="Alessandra"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="max-w-[80%] rounded-xl px-4 py-2 bg-white dark:bg-gray-700 rounded-bl-none shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        {showInput && (
          <ChatInput
            onSubmit={handleSubmit}
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            inputType={step === 2 ? 'tel' : 'text'}
            placeholder={step === 1 ? 'Digite seu nome...' : 'Digite seu WhatsApp...'}
          />
        )}
        {showOptions.length > 0 && (
          <div className="w-full grid grid-cols-1 gap-2">
            {showOptions.map((option, index) => (
              <Button key={index} variant="outline" className="w-full justify-start p-4 h-auto text-left" onClick={() => handleNextStep(option)}>
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelPage;