"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatHeader } from '@/components/ChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { ReportImage } from '@/components/ReportImage';
import { OfferCard } from '@/components/OfferCard';
import { SlotsRemaining } from '@/components/SlotsRemaining';
import { CtaButton } from '@/components/CtaButton';
import { WhatsIncluded } from '@/components/WhatsIncluded';
import { BackgroundMusicPlayer } from '@/components/BackgroundMusicPlayer';
import { AlessandraAudios } from '@/constants/audioPaths';
import { MusicControlIsland } from '@/components/MusicControlIsland'; // Importar o novo componente

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

const calculateDelay = (content: string | React.ReactNode): number => {
  let textContent = '';

  if (typeof content === 'string') {
    textContent = content;
  } else if (React.isValidElement(content)) {
    const children = (content as any).props?.children;
    if (Array.isArray(children)) {
      textContent = children.map(child => {
        if (typeof child === 'string') return child;
        if (React.isValidElement(child) && typeof child.props?.children === 'string') return child.props.children;
        return '';
      }).join(' ');
    } else if (typeof children === 'string') {
      textContent = children;
    }
  }

  textContent = textContent.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();

  const baseDelay = 500;
  const charsPerMs = 50;
  const minDelay = 1000;
  const maxDelay = 6000;

  const calculatedDelay = baseDelay + (textContent.length * charsPerMs);
  return Math.max(minDelay, Math.min(maxDelay, calculatedDelay));
};

const PitchTestPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData] = useState({ name: 'Guerreira', whatsapp: '' });
  const [typingIndicator, setTypingIndicator] = useState<boolean>(false);
  const [playBackgroundMusic, setPlayBackgroundMusic] = useState(false);
  const [showMusicControlIsland, setShowMusicControlIsland] = useState(false); // Novo estado para o popup
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageReceivedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);
  
  useEffect(() => {
    messageReceivedAudioRef.current = new Audio(AlessandraAudios.messageReceived);
    return () => {
      messageReceivedAudioRef.current?.pause();
      messageReceivedAudioRef.current = null;
    };
  }, []);

  // Efeito para mostrar o MusicControlIsland após 5 segundos e mantê-lo visível
  useEffect(() => {
    let timer: number;
    if (playBackgroundMusic && !showMusicControlIsland) {
      timer = window.setTimeout(() => {
        setShowMusicControlIsland(true);
      }, 5000);
    }
    // O popup permanece visível mesmo se a música for pausada
    return () => clearTimeout(timer);
  }, [playBackgroundMusic, showMusicControlIsland]);

  const addMessage = useCallback((
    sender: 'bot' | 'user',
    content: React.ReactNode,
    type: 'texto' | 'custom-component' = 'texto'
  ) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      remetente: sender === 'bot' ? 'Alessandra' : 'user',
      texto: content,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: type,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const displayBotMessage = useCallback(async (messageContent: React.ReactNode, type: Message['tipo'] = 'texto') => {
    messageReceivedAudioRef.current?.play().catch(e => console.log("Erro ao reproduzir som de mensagem recebida:", e));

    addMessage('bot', messageContent, type);
    const readingDelay = calculateDelay(messageContent);
    setTypingIndicator(true);
    await new Promise(res => setTimeout(res, readingDelay));
    setTypingIndicator(false);
  }, [addMessage]);

  useEffect(() => {
    const runPitchSequence = async () => {
      setPlayBackgroundMusic(true);
      await displayBotMessage(`${userData.name}, com base no que você me respondeu, eu preparei uma análise do seu caso…`);
      await displayBotMessage(<ReportImage userName={userData.name} />, 'custom-component');
      await displayBotMessage(<>Nesse relatório eu explico:<br/><br/>✅ O que tá travando seu corpo<br/>✅ Por que nada funcionou até agora<br/>✅ E como começar o H.I.T.S. HOJE pra mudar isso</>);
      await displayBotMessage('MAS…');
      await displayBotMessage('Eu só libero esse relatório e o protocolo completo pra quem tá decidida de verdade.');
      await displayBotMessage(<>Porque não é mais um videozinho qualquer…<br/>É um método testado, com passo a passo, e resultado de verdade.</>);
      await displayBotMessage('E pra você que chegou até aqui, eu consegui liberar um acesso promocional:');
      await displayBotMessage(<OfferCard />, 'custom-component');
      await displayBotMessage('Mas tem um detalhe:\nEu só consigo segurar esse valor pras PRIMEIRAS 30 alunas que finalizarem hoje.');
      await displayBotMessage(<SlotsRemaining />, 'custom-component');
      await displayBotMessage('Quer mudar de verdade?\nEntão clica aqui e garante agora:');
      await displayBotMessage(<CtaButton />, 'custom-component');
      await displayBotMessage(<WhatsIncluded />, 'custom-component');
    };

    runPitchSequence();
  }, [displayBotMessage, userData.name]);

  return (
    <>
      <BackgroundMusicPlayer isPlaying={playBackgroundMusic} audioSrc="/background-music.mp3" />
      <MusicControlIsland 
        isPlaying={playBackgroundMusic} 
        onTogglePlay={() => setPlayBackgroundMusic(prev => !prev)} 
        isVisible={showMusicControlIsland} 
      />
      <div className="h-dvh grid grid-rows-[auto_1fr] bg-[#0f1418] w-full">
        <ChatHeader />
        <div className="relative overflow-hidden h-full">
          <div className="overflow-y-auto overscroll-y-contain p-4 space-y-4 h-full">
            {messages.map(msg => (
              <MensagemBalao key={msg.id} {...msg} onOptionClick={() => {}} />
            ))}
            {typingIndicator && (
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
        </div>
      </div>
    </>
  );
};

export default PitchTestPage;