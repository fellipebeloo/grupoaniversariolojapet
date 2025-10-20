"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AffiliateChatHeader } from '@/components/AffiliateChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { ChatInput } from '@/components/ChatInput';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';
import { trackWhatsAppLead } from '@/utils/facebookPixel';
import { AlessandraAudios } from '@/constants/audioPaths';

interface Message {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'custom-component';
  options?: string[];
}

const TypingIndicator = () => (
  <div className="typing-indicator flex items-center space-x-2">
    <span />
    <span />
    <span />
  </div>
);

const AffiliateLeadPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData, setUserData] = useState({ name: '', whatsapp: '' });
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [typingIndicator, setTypingIndicator] = useState<boolean>(false);
  const [showInput, setShowInput] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('Sua resposta...');
  const [currentInputType, setCurrentInputType] = useState<'text' | 'tel'>('text');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const messageSentAudioRef = useRef<HTMLAudioElement | null>(null);
  const messageReceivedAudioRef = useRef<HTMLAudioElement | null>(null);

  // Configurações do Grupo de Afiliados
  const AFFILIATE_GROUP = {
    name: 'Afiliados H.I.T.S. - Fature R$5k+',
    link: 'https://chat.whatsapp.com/SEU_LINK_DE_CONVITE_AQUI', // SUBSTITUA PELO LINK REAL
    description: 'Instruções para Afiliados e Comissões Generosas',
    buttonText: 'Entrar no Grupo de Afiliados',
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);

  useEffect(() => {
    messageSentAudioRef.current = new Audio(AlessandraAudios.messageSent);
    messageReceivedAudioRef.current = new Audio(AlessandraAudios.messageReceived);

    return () => {
      messageSentAudioRef.current?.pause();
      messageSentAudioRef.current = null;
      messageReceivedAudioRef.current?.pause();
      messageReceivedAudioRef.current = null;
    };
  }, []);

  const addMessage = useCallback((
    sender: 'bot' | 'user',
    content: React.ReactNode,
    type: Message['tipo'] = 'texto'
  ) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      remetente: sender === 'bot' ? 'Diêgo Braga' : 'user', // Remetente agora é Diêgo Braga
      texto: content,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: type,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const showTypingAndDelay = async (delay = 1000) => {
    setTypingIndicator(true);
    await new Promise(res => setTimeout(res, delay));
    setTypingIndicator(false);
  };

  const processBotMessage = async (content: React.ReactNode, type: Message['tipo'] = 'texto') => {
    messageReceivedAudioRef.current?.play().catch(e => console.log("Erro ao reproduzir som de mensagem recebida:", e));
    addMessage('bot', content, type);
  };

  const handleNextStep = async (userResponse: string) => {
    messageSentAudioRef.current?.play().catch(e => console.log("Erro ao reproduzir som de mensagem enviada:", e));

    setMessages(prevMessages => {
      const userMessage: Message = {
        id: `${Date.now()}-${Math.random()}`,
        remetente: 'user',
        texto: userResponse,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tipo: 'texto',
      };
      return [...prevMessages, userMessage];
    });

    setInputValue('');
    setShowInput(false);

    setStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    if (step === 0) {
      setUserData(prev => ({ ...prev, name: inputValue }));
      handleNextStep(inputValue);
    } else if (step === 1) {
      setUserData(prev => ({ ...prev, whatsapp: inputValue }));
      // Disparar evento do Facebook Pixel aqui
      trackWhatsAppLead(userData.name, inputValue);
      handleNextStep(inputValue);
    }
  };

  useEffect(() => {
    const runConversation = async () => {
      setShowInput(false);
      setCurrentPlaceholder('Sua resposta...');
      setCurrentInputType('text');

      switch (step) {
        case 0:
          // Garante que a mensagem inicial só seja enviada se a conversa não tiver começado
          if (messages.length === 0) {
            await showTypingAndDelay();
            await processBotMessage(
              <>
                Olá! Que bom que você decidiu dar o próximo passo para faturar <strong>R$5k a R$10k a mais por mês</strong>, usando apenas a sua carteira de clientes atual! 🚀
                <br/><br/>
                As vagas para o nosso grupo de instrução são super limitadas. Para garantir a sua, me diga: Qual é o seu nome?
              </>
            );
            setCurrentPlaceholder('Digite seu nome...');
            setCurrentInputType('text');
            setShowInput(true);
          }
          break;
        case 1:
          await showTypingAndDelay();
          await processBotMessage(
            <>
              Perfeito, {userData.name}! Para eu te enviar o link de acesso imediato ao grupo e garantir que sua vaga seja reservada, preciso do seu WhatsApp.
              <br/><br/>
              Lembre-se: as vagas estão correndo!
            </>
          );
          setCurrentPlaceholder('Digite seu WhatsApp...');
          setCurrentInputType('tel');
          setShowInput(true);
          break;
        case 2:
          await showTypingAndDelay();
          await processBotMessage(
            <>
              Parabéns, {userData.name}! Sua vaga está garantida. Clique no convite abaixo para entrar no grupo e começar a receber as instruções para se tornar um afiliado de sucesso!
            </>
          );
          await showTypingAndDelay(500);
          await processBotMessage(
            <GroupInviteMessage 
              groupName={AFFILIATE_GROUP.name}
              inviteLink={AFFILIATE_GROUP.link}
              description={AFFILIATE_GROUP.description}
              buttonText={AFFILIATE_GROUP.buttonText}
            />,
            'custom-component'
          );
          // Fim da conversa, input permanece desativado
          break;
        default:
          break;
      }
    };

    runConversation();
  }, [step, userData.name, addMessage]);

  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_auto] bg-[#0f1418] w-full">
      <AffiliateChatHeader />
      
      <div className="relative overflow-hidden h-full">
        <div 
          className="overflow-y-auto overscroll-y-contain p-4 space-y-4 h-full"
        >
          {messages.map(msg => (
            <MensagemBalao key={msg.id} {...msg} onOptionClick={() => {}} />
          ))}
          {typingIndicator && (
            <div className="flex items-end gap-2 justify-start">
              <img
                src="/felipe.jpg"
                alt="Diêgo Braga"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="max-w-[80%] rounded-xl px-4 py-2 bg-[#202c33] rounded-bl-none shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-[#202c33] border-t border-gray-700">
        {showInput && step < 2 && (
          <ChatInput
            onSubmit={handleSubmit}
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            inputType={currentInputType}
            placeholder={currentPlaceholder}
          />
        )}
      </div>
    </div>
  );
};

export default AffiliateLeadPage;