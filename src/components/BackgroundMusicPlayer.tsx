"use client";

import React, { useEffect, useRef } from 'react';

interface BackgroundMusicPlayerProps {
  isPlaying: boolean;
  audioSrc: string; // Nova propriedade para o caminho do arquivo MP3
  volume?: number; // Adiciona uma propriedade de volume opcional
}

export const BackgroundMusicPlayer = ({ isPlaying, audioSrc, volume = 0.1 }: BackgroundMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0; // Começa com volume zero para o fade-in
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch(e => console.error("Erro ao tentar reproduzir música de fundo:", e));

      // Clear any existing fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      // Fade in
      fadeIntervalRef.current = window.setInterval(() => {
        if (audio.volume < volume) {
          audio.volume = Math.min(audio.volume + 0.01, volume);
        } else {
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
        }
      }, 100); // Ajuste o intervalo para um fade mais suave ou rápido
    } else {
      // Clear any existing fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      // Fade out
      fadeIntervalRef.current = window.setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume = Math.max(audio.volume - 0.01, 0);
        } else {
          audio.pause();
          audio.currentTime = 0; // Reseta para o início
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
        }
      }, 100); // Ajuste o intervalo para um fade mais suave ou rápido
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      // Pausa e reseta o áudio ao desmontar o componente
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying, audioSrc, volume]);

  return null; // Este componente não renderiza nada visualmente
};