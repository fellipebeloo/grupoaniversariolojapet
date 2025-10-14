"use client";

import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicControlIslandProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  isVisible: boolean;
}

export const MusicControlIsland = ({ isPlaying, onTogglePlay, isVisible }: MusicControlIslandProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Optionally hide it immediately if isVisible becomes false
      setShow(false);
    }
  }, [isVisible]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "bg-black/80 backdrop-blur-md rounded-full px-4 py-2",
        "flex items-center gap-3 text-white shadow-lg",
        "transition-all duration-500 ease-in-out",
        "max-w-[calc(100%-2rem)]", // Ensure it doesn't overflow on small screens
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      )}
    >
      <button onClick={onTogglePlay} className="flex items-center justify-center p-1 rounded-full hover:bg-white/20 transition-colors">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="flex items-center gap-1">
        <span className={cn("w-1.5 h-1.5 rounded-full bg-white", isPlaying && "animate-pulse-slow")} style={{ animationDelay: '0s' }}></span>
        <span className={cn("w-1.5 h-1.5 rounded-full bg-white", isPlaying && "animate-pulse-slow")} style={{ animationDelay: '0.2s' }}></span>
        <span className={cn("w-1.5 h-1.5 rounded-full bg-white", isPlaying && "animate-pulse-slow")} style={{ animationDelay: '0.4s' }}></span>
      </div>
      <span className="text-sm font-medium">Música</span>
    </div>
  );
};