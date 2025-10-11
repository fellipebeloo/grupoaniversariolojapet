import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const onScrub = (value: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(value);
      setCurrentTime(Number(value));
    }
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full max-w-[250px] text-white">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
      <button onClick={togglePlayPause} className="flex-shrink-0">
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </button>
      <div className="flex-grow flex items-center h-1 bg-gray-500/50 rounded-full relative">
        <div
          className="absolute h-1 bg-white rounded-l-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow -top-1"
          style={{ left: `calc(${progressPercentage}% - 6px)` }}
        ></div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="any"
          value={currentTime}
          onChange={(e) => onScrub(e.target.value)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="text-xs text-gray-400 ml-2 w-10 text-left">
        {formatTime(duration)}
      </span>
    </div>
  );
};