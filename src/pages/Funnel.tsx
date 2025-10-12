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

// Função auxiliar para calcular o atraso com base no conteúdo da mensagem
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

  const baseDelay = 1000; // Atraso base em ms (tempo mínimo para ler uma mensagem curta)
  const charsPerMs = 40;  // ms por caractere (aproximadamente 25 caracteres por segundo para leitura)
  const minDelay = 1500;  // Atraso total mínimo
  const maxDelay = 6000;  // Atraso total máximo

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'chat' | 'group'>('chat');

  // Ref para controlar os passos já processados
  const processedSteps = useRef<Set<number>>(new Set());

  useEffect(() => {
    localStorage.setItem('funnelUserData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const stepFromParam = searchParams.get('step');
    if (stepFromParam) {
      const numericStep = parseInt(stepFromParam, 10);
      if (step !== numericStep) {
        setMessages([]); // Limpa mensagens para reconstruir a conversa
        processedSteps.current.clear(); // Limpa os passos processados também
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

  const addMessage = useCallback((
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
  }, [messages.length]);

  const handleNextStep = async (userResponse: string) => {
    // 1. Adiciona a mensagem do usuário imediatamente
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

    // 2. Calcula o tempo de "processamento" (leitura da resposta do usuário)
    const processingDelay = calculateDelay(userResponse);

    // 3. Mostra o indicador de digitação enquanto o bot "processa"
    setTypingIndicator('text');
    await new Promise(res => setTimeout(res, processingDelay));

    // 4. Esconde o indicador e avança o passo
    setTypingIndicator(null);
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
    setStep(10); // Retorna ao passo 10 após sair do grupo (antigo step 9)
  };

  // Refatorando a lógica de exibição de mensagens do bot em uma função auxiliar
  const displayBotMessage = useCallback(async (messageContent: React.ReactNode, options?: string[], type: Message['tipo'] = 'texto') => {
    // Para mensagens de áudio, mostramos um indicador de gravação antes de exibir o player
    if (type === 'audio') {
      setTypingIndicator('audio');
      await new Promise(res => setTimeout(res, 1000)); // Curto atraso para o indicador de gravação
      setTypingIndicator(null); // Esconde o indicador de gravação antes de mostrar o player
      addMessage('bot', messageContent, options, type);
      // O tempo de "leitura" para áudio é o próprio tempo de reprodução.
      // A próxima ação será acionada pelo `onAudioEnded` do player.
      return;
    }

    // Para mensagens de texto e componentes customizados:
    // 1. Adiciona a mensagem/componente ao chat imediatamente.
    addMessage('bot', messageContent, options, type);

    // 2. Calcula o tempo de leitura para a mensagem que acabou de ser adicionada.
    const readingDelay = calculateDelay(messageContent);

    // 3. Mostra o indicador de digitação enquanto o usuário lê.
    setTypingIndicator('text');
    await new Promise(res => setTimeout(res, readingDelay));

    // 4. Esconde o indicador após o tempo de leitura.
    setTypingIndicator(null);

  }, [addMessage]);

  useEffect(() => {
    const runConversation = async () => {
      if (processedSteps.current.has(step)) {
        return;
      }
      processedSteps.current.add(step);

      setShowInput(false); // Esconde o input por padrão no início de cada passo do bot

      switch (step) {
        case 0:
          await displayBotMessage(<>Oi! Eu sou a Alessandra do Time H.I.T.S. 👋<br/>Posso montar um plano personalizado pra você, mas antes…<br/>Como posso te chamar? 😊</>);
          setShowInput(true);
          break;
        case 1:
          await displayBotMessage(`Perfeito, ${userData.name}! E me passa seu WhatsApp pra eu te enviar o mini-relatório?`);
          setShowInput(true);
          break;
        case 2: // Alessandra audio 1
          await displayBotMessage(
            <WhatsAppAudioPlayer
              audioSrc={AlessandraAudios.alessandraChatAudio1}
              messageTime={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              transcription={AlessandraAudios.alessandraChatAudio1Transcription.replace('[Nome do Usuário]', userData.name)}
              senderName="Alessandra"
              onAudioEnded={() => setStep(3)} // Avança para o próximo passo após o áudio terminar
            />,
            undefined,
            'audio'
          );
          break;
        case 3: // Mensagem de texto após o áudio 1
          await displayBotMessage(<>Fechado! Agora me responde rapidinho: Quando você se olha no espelho… o que mais te incomoda hoje, {userData.name}?</>, ['A barriga / pochete que não some', 'Corpo sem firmeza', 'Inchaço e peso', 'Falta de energia']);
          setShowInput(true);
          break;
        case 4:
          await displayBotMessage('Entendi, isso é mais comum do que parece... E me diz: o que você já tentou pra resolver isso?', ['Dietas malucas', 'Vídeos de treino do YouTube', 'Caminhada quando dá', 'Já tentei de tudo, sério']);
          setShowInput(true);
          break;
        case 5:
          await displayBotMessage(`Agora seja sincera comigo, ${userData.name}... Quanto tempo você consegue tirar só pra você no dia?`, ['15 minutos', '20 a 30 minutos', 'Mais de 30, se for mágica', 'Quase nenhum tempo 😅']);
          setShowInput(true);
          break;
        case 6:
          await displayBotMessage('E pra fechar: Se daqui 21 dias você se olhar no espelho, o que você quer ver?', ['Roupa servindo melhor', 'Barriga mais sequinha', 'Corpo mais firme', 'Meu sorriso de volta']);
          setShowInput(true);
          break;
        case 7: // Alessandra audio 2
          await displayBotMessage(
            <WhatsAppAudioPlayer
              audioSrc={AlessandraAudios.alessandraChatAudio2}
              messageTime={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              transcription={AlessandraAudios.alessandraChatAudio2Transcription.replace('[Nome do Usuário]', userData.name)}
              senderName="Alessandra"
              onAudioEnded={() => setStep(8)} // Avança para o próximo passo após o áudio terminar
            />,
            undefined,
            'audio'
          );
          break;
        case 8: // Mensagem de texto após o áudio 2
          await displayBotMessage(<>Arrasou, {userData.name}!<br/>Com base nas suas respostas, eu já consigo ver o que tá travando seu corpo.<br/><br/>Posso te mostrar o que é esse tal de Efeito Pochete Teimosa?</>, ['👉 Quero entender por que meu corpo trava']);
          setShowInput(true);
          break;
        case 9:
          await displayBotMessage(`${userData.name}, antes de te explicar por que seu corpo tá travando, quero te mostrar algo...`);
          await displayBotMessage('Tem um grupo onde várias mulheres como você compartilham o que aconteceu depois que começaram a treinar comigo.');
          await displayBotMessage('Olha só:');
          await displayBotMessage(<GroupInviteMessage onViewClick={() => setActiveView('group')} />, undefined, 'custom-component');
          break;
        case 10:
          await displayBotMessage('Viu só? Isso é o que acontece quando você destrava a queima de gordura do jeito certo. Pronta pra eu te mostrar como fazer isso?', ['Sim, me mostra!']);
          setShowInput(true);
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
          setShowInput(true);
          break;
        case 12:
          await displayBotMessage(`${userData.name || 'Guerreira'}, bora ver o quanto suas escolhas diárias tão te ajudando… ou te sabotando?`);
          await displayBotMessage('Esse é o Jogo da Vida Fitness. Você vai fazer 5 escolhas de situações do dia a dia. No final, eu te conto o que tá pegando.');
          await displayBotMessage(<GameStartMessage userName={userData.name || 'Guerreira'} />, undefined, 'custom-component');
          break;
        case 13:
          await displayBotMessage(`Uau, ${userData.name || 'Guerreira'}! Viu como as pequenas coisas fazem a diferença?`);
          await displayBotMessage('Agora que você sabe o que te trava, tá na hora de conhecer o que vai te destravar de vez.');
          await displayBotMessage('Preparada para conhecer o método H.I.T.S.?', ['Sim, estou pronta!']);
          setShowInput(true);
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
              {messages.map(msg => (
                <MensagemBalao key={msg.id} {...msg} onOptionClick={handleNextStep} />
              ))}
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