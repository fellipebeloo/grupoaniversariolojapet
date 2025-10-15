import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioMessageProps {
  audioSrc: string;
}

export const AudioMessage = ({ audioSrc }: AudioMessageProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audioRef.current = new Audio(audioSrc);
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const togglePlay = () => setIsPlaying(!audio.paused);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', togglePlay);
    audio.addEventListener('pause', togglePlay);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // Auto-play the audio when the component mounts
    audio.play().catch(error => console.log("Audio auto-play blocked:", error));

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', togglePlay);
      audio.removeEventListener('pause', togglePlay);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioSrc]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-1 bg-[#202c33] rounded-xl p-2 px-3 w-full shadow-sm"> {/* Removido max-w-[80%] */}
      <button onClick={togglePlayback} className="text-white p-1 rounded-full bg-[#00a884] hover:bg-[#008f6f] transition-colors flex-shrink-0">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="flex-grow flex items-center h-1 bg-gray-500/50 rounded-full relative">
        <div 
          className="h-1 bg-white rounded-l-full" 
          style={{ width: `${progress}%` }}
        ></div>
        <div 
          className="w-3 h-3 bg-white rounded-full shadow -ml-1.5 absolute" 
          style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-400 ml-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
};