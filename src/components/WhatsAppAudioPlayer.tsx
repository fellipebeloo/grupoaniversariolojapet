"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Loader2, CheckCheck, Mic, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppAudioPlayerProps {
  audioSrc: string; // Agora espera apenas uma string para o caminho do MP3
  isMine?: boolean;
  messageTime: string;
  transcription?: string;
  senderName: string;
  profileImageUrl?: string;
  onAudioEnded?: () => void;
  hasBeenPlayed?: boolean;
  onFirstPlay?: () => void;
}

export const WhatsAppAudioPlayer = ({
  audioSrc,
  isMine = false,
  messageTime,
  transcription,
  senderName,
  profileImageUrl,
  onAudioEnded,
  hasBeenPlayed = false,
  onFirstPlay,
}: WhatsAppAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [percentPlayed, setPercentPlayed] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

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

  const handleSpeedChange = useCallback(() => {
    setPlaybackRate(currentRate => {
      let newRate;
      if (currentRate === 1.0) newRate = 1.5;
      else if (currentRate === 1.5) newRate = 2.0;
      else newRate = 1.0;
      
      if (audioRef.current) {
        audioRef.current.playbackRate = newRate;
      }
      return newRate;
    });
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    // Define o src diretamente para o arquivo MP3
    audio.src = audioSrc;
    audio.load(); // Carrega o novo áudio
    audio.playbackRate = playbackRate;

    const onLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      if (!hasBeenPlayed) {
        audio.play().catch(error => {
          console.log("Audio auto-play blocked:", error);
          setIsPlaying(false);
        });
        onFirstPlay?.();
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      setHasStartedPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setPercentPlayed((audio.currentTime * 100) / audio.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
      setCurrentTime(0);
      setPercentPlayed(0);
      onAudioEnded?.();
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
  }, [audioSrc, onAudioEnded, hasBeenPlayed, onFirstPlay, playbackRate]);

  const playerBgColor = isMine ? 'bg-[#005c4b]' : 'bg-[#202c33]';
  const featuredColor = 'text-[#00e5c0]';
  const textColor = 'text-[#c5c6c8]';

  return (
    <div className={cn(
      "flex flex-col min-w-[240px] max-w-[70%] rounded-xl shadow-sm user-select-none font-sans",
      playerBgColor,
    )}>
      {!isMine && (
        <p className="text-sm font-semibold text-green-400 pt-2 px-3 mb-1">{senderName}</p>
      )}
      <div className="flex items-center pt-2 px-3">
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

        <div className="flex-1 flex flex-col relative ml-2">
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

        <div className="relative ml-4 flex-shrink-0 w-14 h-14">
          {hasStartedPlaying ? (
            <button
              type="button"
              onClick={handleSpeedChange}
              className={cn(
                "w-full h-full rounded-full flex items-center justify-center font-semibold transition-colors",
                "bg-white/10 hover:bg-white/20 text-white text-sm"
              )}
            >
              {playbackRate.toFixed(1)}x
            </button>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-500 overflow-hidden flex items-center justify-center">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt={senderName} className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
          )}
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
          "text-base px-3 pb-2 whitespace-pre-wrap",
          'text-gray-400'
        )}>
          {transcription}
        </p>
      )}
    </div>
  );
};