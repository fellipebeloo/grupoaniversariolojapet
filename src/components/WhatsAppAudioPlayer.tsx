"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Loader2, CheckCheck, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Importando Avatar components

interface WhatsAppAudioPlayerProps {
  audioSrc: string;
  isMine?: boolean; // true for user's message, false for bot's
  senderAvatar?: string;
  messageTime: string;
  transcription?: string; // Nova prop para a transcrição
  senderName: string; // Nova prop para o nome do remetente
  onAudioEnded?: () => void; // Nova prop para callback ao finalizar o áudio
}

export const WhatsAppAudioPlayer = ({
  audioSrc,
  isMine = false,
  senderAvatar = '/alessandra.jpg', // Default to Alessandra's avatar
  messageTime,
  transcription,
  senderName,
  onAudioEnded, // Destruturando a nova prop
}: WhatsAppAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [percentPlayed, setPercentPlayed] = useState(0);

  const formatTimeToDisplay = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const handlePlayButton = useCallback(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
  }, [isPlaying]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const percent = parseFloat(e.target.value);
      const newTime = (percent * duration) / 100;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPercentPlayed(percent);
    }
  }, [duration]);

  useEffect(() => {
    audioRef.current = new Audio(audioSrc);
    const audio = audioRef.current;

    const onLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      // Auto-play on load, but catch potential browser restrictions
      audio.play().catch(error => {
        console.log("Audio auto-play blocked:", error);
        setIsPlaying(false); // Ensure play button shows if auto-play fails
      });
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setPercentPlayed((audio.currentTime * 100) / audio.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0; // Reset to start
      setCurrentTime(0);
      setPercentPlayed(0);
      onAudioEnded?.(); // Chama o callback quando o áudio termina
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);

    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [audioSrc, onAudioEnded]); // Adiciona onAudioEnded como dependência

  const playerBgColor = isMine ? 'bg-[#005c4b]' : 'bg-[#202c33]'; // Ajustado para as cores das bolhas de mensagem
  const featuredColor = 'text-[#00e5c0]'; // Using text color for icons/progress
  const textColor = 'text-[#c5c6c8]';

  return (
    <div className={cn( // Este é o container principal da bolha de mensagem de áudio
      "flex flex-col min-w-[240px] max-w-[70%] rounded-xl shadow-sm user-select-none font-sans",
      playerBgColor,
    )}>
      {!isMine && ( // Renderiza o nome do remetente se não for minha mensagem
        <p className="text-sm font-semibold text-green-400 pt-2 px-3 mb-1">{senderName}</p>
      )}
      {/* Parte superior: controles de áudio e avatar */}
      <div className="flex items-center pt-2 px-3"> {/* Preenchimento consistente superior/lateral */}
        <button
          type="button"
          onClick={handlePlayButton}
          disabled={isLoading}
          className={cn(
            "appearance-none cursor-pointer bg-none border-0 p-0",
            isLoading ? 'pointer-events-none' : ''
          )}
        >
          {isLoading ? (
            <Loader2 size={38} className={cn("animate-spin", textColor)} />
          ) : isPlaying ? (
            <Pause size={38} className={cn(textColor, 'opacity-80')} />
          ) : (
            <Play size={38} className={cn(textColor, 'opacity-80')} />
          )}
        </button>

        <div className="flex-1 flex flex-col relative ml-2"> {/* Adicionado ml-2 para espaçamento após o botão de play */}
          <div className="flex-1 flex items-center relative">
            <div
              className="absolute bg-[#00e5c0] h-[0.24rem] rounded-full"
              style={{ width: `${percentPlayed}%` }}
            ></div>
            <input
              ref={sliderRef}
              dir="ltr"
              type="range"
              min="0"
              max="100"
              value={percentPlayed}
              onChange={handleSliderChange}
              className={cn(
                "flex-1 appearance-none bg-transparent border-0 outline-none w-full relative",
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#00e5c0] [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:-mt-[0.336rem]",
                "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#00e5c0] [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:-mt-[0.336rem]",
                "[&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:h-[0.24rem] [&::-webkit-slider-runnable-track]:rounded-full",
                "[&::-moz-range-track]:bg-white/20 [&::-moz-range-track]:h-[0.24rem] [&::-moz-range-track]:rounded-full"
              )}
            />
          </div>
          <div className={cn("flex items-center justify-between text-xs mt-1", textColor)}>
            <div className="current-time">{formatTimeToDisplay(currentTime)}</div>
            <div className="flex items-center">
              <div className="time">{formatTimeToDisplay(duration)}</div>
              {isMine && <CheckCheck size={16} className={cn("ml-1", featuredColor)} />}
            </div>
          </div>
        </div>

        {/* Avatar com ícone de microfone sobreposto */}
        <div className="relative ml-4 flex-shrink-0">
          <Avatar className="w-14 h-14">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Mic
            size={26}
            className={cn(
              "absolute bottom-0 left-0 -translate-x-1/2",
              featuredColor,
            )}
            style={{ textShadow: `-1px -1px 0 ${isMine ? '#005c4b' : '#202c33'}, 1px -1px 0 ${isMine ? '#005c4b' : '#202c33'}, -1px 1px 0 ${isMine ? '#005c4b' : '#202c33'}, 1px 1px 0 ${isMine ? '#005c4b' : '#202c33'}` }}
          />
        </div>
      </div>

      {transcription && (
        <p className={cn(
          "text-base px-3 pb-2 whitespace-pre-wrap", // Alterado de text-sm para text-base
          isMine ? 'text-white' : 'text-gray-100'
        )}>
          {transcription}
        </p>
      )}
    </div>
  );
};