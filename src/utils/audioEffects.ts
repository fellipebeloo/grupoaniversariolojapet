"use client";

// Garante que o código só rode no navegador
const isBrowser = typeof window !== 'undefined';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (isBrowser && !audioContext) {
    // Compatibilidade com navegadores mais antigos
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playTone = (type: 'sent' | 'received') => {
  const context = getAudioContext();
  if (!context) {
    console.warn('Web Audio API não é suportada neste navegador.');
    return;
  }

  // Alguns navegadores suspendem o contexto de áudio até uma interação do usuário
  if (context.state === 'suspended') {
    context.resume();
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  if (type === 'sent') {
    oscillator.frequency.setValueAtTime(880, context.currentTime); // Tom mais agudo para envio
    gainNode.gain.setValueAtTime(0.08, context.currentTime);
  } else { // received
    oscillator.frequency.setValueAtTime(660, context.currentTime); // Tom mais grave para recebimento
    gainNode.gain.setValueAtTime(0.08, context.currentTime);
  }

  oscillator.type = 'sine';
  
  const now = context.currentTime;
  // Efeito de fade-out para o som não ser abrupto
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
  
  oscillator.start(now);
  oscillator.stop(now + 0.15);
};