"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AffiliateChatHeader } from '@/components/AffiliateChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';
import { AudioPaths } from '@/constants/audioPaths';

interface Message {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'custom-component';
}

const TypingIndicator = () => (
  <div className="typing-indicator flex items-center space-x-2">
    <span />
    <span />
    <span />
  </div>
);

const AffiliateGroupPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingIndicator, setTypingIndicator] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const messageReceivedAudioRef = useRef<HTMLAudioElement | null>(null);

  // Configurações do Grupo de Afiliados
  const AFFILIATE_GROUP = {
    name: 'AFILIADOS REPRESENTANTES',
    link: 'https://chat.whatsapp.com/JIOv2ec9Nuz4z198zuS7XO?mode=wwc',
    description: 'Grupo para Afiliados Representantes',
    buttonText: 'Entrar no Grupo',
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);

  useEffect(() => {
    messageReceivedAudioRef.current = new Audio(AudioPaths.messageReceived);

    return () => {
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
      remetente: sender === 'bot' ? 'Diêgo Braga' : 'user',
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

  const handleJoinGroupClick = () => {
    window.open(AFFILIATE_GROUP.link, '_blank');
  };

  useEffect(() => {
    const runConversation = async () => {
      // Mensagem de boas-vindas
      await showTypingAndDelay();
      await processBotMessage(
        <>
          Olá! Que bom que você decidiu dar o próximo passo para faturar <strong>R$5k a R$10k a mais por mês</strong>, usando apenas a sua carteira de clientes atual! 🚀
          <br/><br/>
          Sua vaga está garantida. Acesse o link abaixo para entrar no grupo.
        </>
      );

      // Mensagem do convite do grupo
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
    };

    // Garante que a conversa só comece uma vez
    if (messages.length === 0) {
      runConversation();
    }
  }, [addMessage, messages.length]);

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

      {/* Rodapé com o botão de entrar no grupo */}
      <div className="p-4 bg-[#202c33] border-t border-gray-700">
        <button
          onClick={handleJoinGroupClick}
          className="w-full py-3 bg-[#00a884] text-white font-bold rounded-lg shadow-lg hover:bg-[#008f6f] transition-colors"
        >
          Entrar no Grupo
        </button>
      </div>
    </div>
  );
};

export default AffiliateGroupPage;