"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AffiliateChatHeader } from '@/components/AffiliateChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';

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
  
  // Configurações do Grupo de Afiliados
  const BLACKFRIDAY_GROUP = {
    name: 'BLACK FRIDAY LOJA PET 🐾',
    link: 'https://chat.whatsapp.com/GKwPpq9VXKiJhaMEIYzfPM?mode=wwc',
    description: 'Grupo Exclusivo Black Friday',
    buttonText: 'Entrar no Grupo',
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);

  const addMessage = useCallback((
    sender: 'bot' | 'user',
    content: React.ReactNode,
    type: Message['tipo'] = 'texto'
  ) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      remetente: sender === 'bot' ? 'Loja Pet' : 'user',
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
    addMessage('bot', content, type);
  };

  const handleJoinGroupClick = () => {
    window.open(BLACKFRIDAY_GROUP.link, '_blank');
  };

  useEffect(() => {
    const runConversation = async () => {
      // Mensagem de boas-vindas
      await showTypingAndDelay();
      await processBotMessage(
        <>
          🚨 <strong>Atenção!</strong> 🚨
          <br/><br/>
          Dia <strong>7/11</strong> vai rolar a Black Friday da Loja Pet — a maior da nossa história! 🖤🐾
          <br/><br/>
          Mas antes disso, a gente quer ouvir <strong>VOCÊ!</strong> 👂💬
          <br/><br/>
          👉 Entra agora no grupo da Black Friday porque hoje vai rolar uma enquete exclusiva pra decidir quais produtos e brindes vocês mais querem ver com desconto! 😱🔥
          <br/><br/>
          💥 Quem estiver no grupo vai ter poder de escolha e ainda vai receber as promoções primeiro!
        </>
      );

      // Mensagem do convite do grupo
      await showTypingAndDelay(500);
      await processBotMessage(
        <GroupInviteMessage 
          groupName={BLACKFRIDAY_GROUP.name}
          inviteLink={BLACKFRIDAY_GROUP.link}
          description={BLACKFRIDAY_GROUP.description}
          buttonText={BLACKFRIDAY_GROUP.buttonText}
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
                src="/lojapet.png"
                alt="Loja Pet"
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