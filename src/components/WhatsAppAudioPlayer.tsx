"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

interface WhatsAppAudioPlayerProps {
  src: string;
  duration: string;
}

export const WhatsAppAudioPlayer = ({ src, duration }: WhatsAppAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 p-2 w-full max-w-xs">
      <audio ref={audioRef} src={src} preload="auto" />
      <button onClick={togglePlay} className="flex-shrink-0 text-white p-2 rounded-full bg-green-500 hover:bg-green-600">
        {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}
      </button>
      <div className="relative flex-grow h-1 bg-gray-500 rounded-full cursor-pointer">
        <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-12 text-right">{duration}</span>
      <Mic size={20} className="text-green-400 flex-shrink-0" />
    </div>
  );
};