"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { ChatHeader } from '@/components/ChatHeader';
import { MensagemBalao } from '@/components/MensagemBalao';
import { ChatInput } from '@/components/ChatInput';
import { WhatsAppAudioPlayer } from '@/components/WhatsAppAudioPlayer';
import { GroupChatView } from '@/components/GroupChatView';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';
import { PocheteTeimosaEffect } from '@/components/PocheteTeimosaEffect';
import { GameStartMessage } from '@/components/GameStartMessage';
import { useSearchParams } from 'react-router-dom';
import { AlessandraAudios } from '@/constants/audioPaths';
import { HitsProtocolCard } from '@/components/HitsProtocolCard';
import { ReportImage } from '@/components/ReportImage';
import { OfferCard } from '@/components/OfferCard';
import { SlotsRemaining } from '@/components/SlotsRemaining';
import { CtaButton } from '@/components/CtaButton';
import { WhatsIncluded } from '@/components/WhatsIncluded';

interface AudioData {
  audioSrc: string;
  transcription: string;
  onAudioEnded: () => void;
}

interface Message {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio' | 'custom-component';
  options?: string[];
  audioData?: AudioData;
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


const FunnelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem('funnelUserData');
      return saved ? JSON.parse(saved) : { name: '', whatsapp: '' };
    } catch (error) {
      return { name: '', whatsapp: '' };
    }
  });
  
  const [step, setStep] = useState(() => {
    const stepFromParam = searchParams.get('step');
    if (stepFromParam) {
      return parseInt(stepFromParam, 10);
    }
    return 0;
  });

  const [inputValue, setInputValue] = useState('');
  const [typingIndicator, setTypingIndicator] = useState<'text' | 'audio' | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('Sua resposta...');
  const [currentInputType, setCurrentInputType] = useState<'text' | 'tel'>('text');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [activeView, setActiveView] = useState<'chat' | 'group'>('chat');
  const [playedAudios, setPlayedAudios] = useState<Set<string>>(new Set());

  const processedSteps = useRef<Set<number>>(new Set());

  const messageSentAudioRef = useRef<HTMLAudioElement | null>(null);
  const messageReceivedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('funnelUserData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const stepFromParam = searchParams.get('step');
    if (stepFromParam) {
      const numericStep = parseInt(stepFromParam, 10);
      if (step !== numericStep) {
        setMessages([]);
        processedSteps.current.clear();
        setStep(numericStep);
      }
      searchParams.delete('step');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, step]);

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
    options?: string[],
    type: 'texto' | 'imagem' | 'audio' | 'custom-component' = 'texto',
    audioData?: AudioData
  ) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      remetente: sender === 'bot' ? 'Alessandra' : 'user',
      texto: content,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: type,
      options,
      audioData,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleNextStep = async (userResponse: string) => {
    messageSentAudioRef.current?.play().catch(e => console.log("Erro ao reproduzir som de mensagem enviada:", e));

    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg => ({ ...msg, options: undefined }));
      const userMessage: Message = {
        id: `${Date.now()}-${Math.random()}`,
        remetente: 'user',
        texto: userResponse,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tipo: 'texto',
      };
      return [...updatedMessages, userMessage];
    });

    setInputValue('');
    setShowInput(false);

    const processingDelay = calculateDelay(userResponse);
    await new Promise(res => setTimeout(res, processingDelay));
    setStep(prev => prev + 1);
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
    if (step < 10) {
      setStep(10);
    }
  };

  const displayBotMessage = useCallback(async (messageContent: React.ReactNode, options?: string[], type: Message['tipo'] = 'texto', audioData?: AudioData) => {
    messageReceivedAudioRef.current?.play().catch(e => console.log("Erro ao reproduzir som de mensagem recebida:", e));

    if (type === 'audio' && audioData) {
      setTypingIndicator('audio');
      await new Promise(res => setTimeout(res, 1000));
      setTypingIndicator(null);
      addMessage('bot', '', options, type, audioData);
      return;
    }

    addMessage('bot', messageContent, options, type);
    const readingDelay = calculateDelay(messageContent);
    setTypingIndicator('text');
    await new Promise(res => setTimeout(res, readingDelay));
    setTypingIndicator(null);
  }, [addMessage]);

  useEffect(() => {
    const runConversation = async () => {
      if (processedSteps.current.has(step)) {
        return;
      }
      processedSteps.current.add(step);

      setShowInput(false);
      setCurrentPlaceholder('Sua resposta...');
      setCurrentInputType('text');

      switch (step) {
        case 0:
          await displayBotMessage(<>Oi! Eu sou a Alessandra do Time H.I.T.S. 👋<br/>Posso montar um plano personalizado pra você, mas antes…<br/>Como posso te chamar? 😊</>);
          setCurrentPlaceholder('Digite seu nome...');
          setCurrentInputType('text');
          setShowInput(true);
          break;
        case 1:
          await displayBotMessage(`Perfeito, ${userData.name}! E me passa seu WhatsApp pra eu te enviar o mini-relatório?`);
          setCurrentPlaceholder('Digite seu WhatsApp...');
          setCurrentInputType('tel');
          setShowInput(true);
          break;
        case 2:
          await displayBotMessage(
            '',
            undefined,
            'audio',
            {
              audioSrc: AlessandraAudios.alessandraChatAudio1,
              transcription: AlessandraAudios.alessandraChatAudio1Transcription.replace('[Nome do Usuário]', userData.name),
              onAudioEnded: () => setStep(3),
            }
          );
          break;
        case 3:
          await displayBotMessage(<>Fechado! Agora me responde rapidinho: Quando você se olha no espelho… o que mais te incomoda hoje, {userData.name}?</>, ['A barriga / pochete que não some', 'Corpo sem firmeza', 'Inchaço e peso', 'Falta de energia']);
          break;
        case 4:
          await displayBotMessage('Entendi, isso é mais comum do que parece... E me diz: o que você já tentou pra resolver isso?', ['Dietas malucas', 'Vídeos de treino do YouTube', 'Caminhada quando dá', 'Já tentei de tudo, sério']);
          break;
        case 5:
          await displayBotMessage(`Agora seja sincera comigo, ${userData.name}... Quanto tempo você consegue tirar só pra você no dia?`, ['15 minutos', '20 a 30 minutos', 'Mais de 30, se for mágica', 'Quase nenhum tempo 😅']);
          break;
        case 6:
          await displayBotMessage('E pra fechar: Se daqui 21 dias você se olhar no espelho, o que você quer ver?', ['Roupa servindo melhor', 'Barriga mais sequinha', 'Corpo mais firme', 'Meu sorriso de volta']);
          break;
        case 7:
          await displayBotMessage(
            '',
            undefined,
            'audio',
            {
              audioSrc: AlessandraAudios.alessandraChatAudio2,
              transcription: AlessandraAudios.alessandraChatAudio2Transcription.replace('[Nome do Usuário]', userData.name),
              onAudioEnded: () => setStep(8),
            }
          );
          break;
        case 8:
          await displayBotMessage(<>Arrasou, {userData.name}!<br/>Com base nas suas respostas, eu já consigo ver o que tá travando seu corpo.<br/><br/>Posso te mostrar o que é esse tal de Efeito Pochete Teimosa?</>, ['👉 Quero entender por que meu corpo trava']);
          break;
        case 9:
          await displayBotMessage(`${userData.name}, antes de te explicar por que seu corpo tá travando, quero te mostrar algo...`);
          await displayBotMessage('Tem um grupo onde várias mulheres como você compartilham o que aconteceu depois que começaram a treinar comigo.');
          await displayBotMessage('Olha só:');
          await displayBotMessage(<GroupInviteMessage onViewClick={() => setActiveView('group')} />, undefined, 'custom-component');
          break;
        case 10:
          await displayBotMessage('Viu só? Isso é o que acontece quando você destrava a queima de gordura do jeito certo. Pronta pra eu te mostrar como fazer isso?', ['Sim, me mostra!']);
          break;
        case 11:
          await displayBotMessage(`${userData.name}, deixa eu te contar uma coisa que eu só descobri depois de MUITO erro e tentativa…`);
          await displayBotMessage('Tem um motivo real pra sua barriga não ir embora, mesmo quando você se esforça.');
          await displayBotMessage(<>É o que eu chamo de:<br/>💥 <strong>EFEITO POCHETE TEIMOSA</strong> 💥</>);
          await displayBotMessage(<PocheteTeimosaEffect />, undefined, 'custom-component');
          await displayBotMessage(<>Esse efeito acontece quando o seu corpo entra num estado de auto-proteção:<br/><br/>Ele sente que tá sendo “atacado”<br/>Começa a segurar gordura (principalmente na barriga)<br/>E PARECE que nada funciona, mesmo com esforço</>);
          await displayBotMessage(<>Sabe quando você treina, sua, se mata… e NADA muda?<br/><br/>É isso.<br/>Mas a culpa não é sua.</>);
          await displayBotMessage('O problema tá no tipo de estímulo que seu corpo tá recebendo. Ele não foi ativado da forma certa.');
          await displayBotMessage('Agora que você entendeu o vilão… Quer saber como eu quebro esse efeito nas minhas alunas?', ['SIM! Me mostra como destravar meu corpo']);
          break;
        case 12:
          await displayBotMessage(`${userData.name || 'Guerreira'}, bora ver o quanto suas escolhas diárias tão te ajudando… ou te sabotando?`);
          await displayBotMessage('Esse é o Jogo da Vida Fitness. Você vai fazer 5 escolhas de situações do dia a dia. No final, eu te conto o que tá pegando.');
          await displayBotMessage(<GameStartMessage userName={userData.name || 'Guerreira'} />, undefined, 'custom-component');
          await displayBotMessage('Clique no botão "Começar o Jogo 🔥" acima para iniciar o desafio e descobrir o que está travando seu corpo!');
          break;
        case 13:
          await displayBotMessage(`Uau, ${userData.name || 'Guerreira'}! Viu como as pequenas coisas fazem a diferença?`);
          await displayBotMessage('Agora que você sabe o que te trava, tá na hora de conhecer o que vai te destravar de vez.');
          await displayBotMessage('Preparada para conhecer o método H.I.T.S.?', ['Sim, estou pronta!']);
          break;
        case 14:
          await displayBotMessage(`${userData.name}, agora eu vou te mostrar o que realmente faz o corpo sair do travamento...`);
          await displayBotMessage(<>O nome disso é:<br/>💥 <strong>PROTOCOLO H.I.T.S.</strong> 💥</>);
          await displayBotMessage(<HitsProtocolCard />, undefined, 'custom-component');
          await displayBotMessage('É um tipo de treino que ativa seu metabolismo em poucos minutos, sem precisar de academia, peso ou experiência.');
          await displayBotMessage(<>Ele é focado em 3 coisas:<br/><br/>✅ Destravar o corpo<br/>✅ Secar a pochete teimosa<br/>✅ E te dar resultado visível em até 21 dias</>);
          await displayBotMessage('É como se fosse um botão RESET no seu corpo.');
          await displayBotMessage('As mulheres que tão fazendo isso comigo já tão sentindo a diferença na disposição, no espelho, na roupa, em tudo.');
          await displayBotMessage('E o melhor: você faz em casa, com o seu tempo, sem depender de nada.');
          await displayBotMessage(<strong>Se você chegou até aqui, é porque seu corpo tá gritando por mudança.</strong>);
          await displayBotMessage('E o Protocolo H.I.T.S. pode ser o seu ponto de virada.', ['Me mostra como eu começo o H.I.T.S.']);
          break;
        case 15:
          await displayBotMessage(`${userData.name}, com base no que você me respondeu, eu preparei uma análise do seu caso…`);
          await displayBotMessage(<ReportImage userName={userData.name || 'Guerreira'} />, undefined, 'custom-component');
          await displayBotMessage(<>Nesse relatório eu explico:<br/><br/>✅ O que tá travando seu corpo<br/>✅ Por que nada funcionou até agora<br/>✅ E como começar o H.I.T.S. HOJE pra mudar isso</>);
          await displayBotMessage('MAS…');
          await displayBotMessage('Eu só libero esse relatório e o protocolo completo pra quem tá decidida de verdade.');
          await displayBotMessage(<>Porque não é mais um videozinho qualquer…<br/>É um método testado, com passo a passo, e resultado de verdade.</>);
          await displayBotMessage('E pra você que chegou até aqui, eu consegui liberar um acesso promocional:');
          await displayBotMessage(<OfferCard />, undefined, 'custom-component');
          await displayBotMessage('Mas tem um detalhe:\nEu só consigo segurar esse valor pras PRIMEIRAS 30 alunas que finalizarem hoje.');
          await displayBotMessage(<SlotsRemaining />, undefined, 'custom-component');
          await displayBotMessage('Quer mudar de verdade?\nEntão clica aqui e garante agora:');
          await displayBotMessage(<CtaButton />, undefined, 'custom-component');
          await displayBotMessage(<WhatsIncluded />, undefined, 'custom-component');
          break;
        default:
          break;
      }
    };
    runConversation();
  }, [step, userData.name, displayBotMessage, addMessage]); 

  return (
    <>
      {activeView === 'chat' && (
        <div className="h-dvh grid grid-rows-[auto_1fr_auto] bg-[#0f1418] w-full">
          <ChatHeader />
          
          <div className="relative overflow-hidden h-full">
            <div 
              className="overflow-y-auto overscroll-y-contain p-4 space-y-4 h-full"
            >
              {messages.map(msg => {
                if (msg.tipo === 'audio' && msg.audioData) {
                  return (
                    <MensagemBalao
                      key={msg.id}
                      {...msg}
                      texto={
                        <WhatsAppAudioPlayer
                          audioSrc={msg.audioData.audioSrc}
                          messageTime={msg.horario}
                          transcription={msg.audioData.transcription}
                          senderName={msg.remetente}
                          profileImageUrl={msg.remetente === 'Alessandra' ? '/alessandra.jpg' : undefined}
                          onAudioEnded={msg.audioData.onAudioEnded}
                          hasBeenPlayed={playedAudios.has(msg.audioData.audioSrc)}
                          onFirstPlay={() => {
                            setPlayedAudios(prev => new Set(prev).add(msg.audioData!.audioSrc));
                          }}
                        />
                      }
                      onOptionClick={handleNextStep}
                    />
                  );
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
                inputType={currentInputType}
                placeholder={currentPlaceholder}
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