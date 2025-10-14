"use client";

import React, { useEffect, useRef } from 'react';

interface BackgroundMusicPlayerProps {
  isPlaying: boolean;
  audioSrc: string;
  volume?: number;
  userInteracted: boolean; // Novo prop
}

export const BackgroundMusicPlayer = ({ isPlaying, audioSrc, volume = 0.1, userInteracted }: BackgroundMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0; // Começa com volume zero para o fade-in
    }

    const audio = audioRef.current;

    if (isPlaying && userInteracted) { // Só tenta reproduzir se o usuário interagiu
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
      }, 100);
    } else if (!isPlaying && audio.played.length > 0) { // Só faz fade out se estava tocando
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
      }, 100);
    } else if (!isPlaying && !userInteracted) { // Se não está tocando e não houve interação, garante que está pausado e resetado
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying, audioSrc, volume, userInteracted]); // Adicionado userInteracted às dependências

  return null;
};