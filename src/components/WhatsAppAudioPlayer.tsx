"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Loader2, CheckCheck, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppAudioPlayerProps {
  audioSrc: string;
  isMine?: boolean; // true for user's message, false for bot's
  senderAvatar?: string;
  messageTime: string;
}

export const WhatsAppAudioPlayer = ({
  audioSrc,
  isMine = false,
  senderAvatar = '/alessandra.jpg', // Default to Alessandra's avatar
  messageTime,
}: WhatsAppAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [percentPlayed, setPercentPlayed] = useState(0);

  // Define colors based on the WhatsApp audio player style
  const playerBgColor = isMine ? 'bg-[#056162]' : 'bg-[#262d31]';
  const progressDotColor = 'text-blue-400'; // Blue for the progress dot and mic icon
  const playPauseIconColor = 'text-gray-400'; // Gray for play/pause icons
  const waveformBarColor = 'bg-gray-500'; // Gray for the waveform bars
  const messageTimeColor = 'text-gray-400'; // Gray for the message time

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
  }, [audioSrc]);

  // Generate a static waveform pattern for visual representation
  const waveformHeights = Array.from({ length: 40 }).map(() => Math.random() * (18 - 6) + 6); // Heights between 6px and 18px

  return (
    <div className={cn(
      "flex min-w-[240px] w-[336px] max-w-full rounded-md p-1 shadow-sm user-select-none font-sans",
      playerBgColor,
      isMine ? 'flex-row-reverse' : 'flex-row' // Reverse order for 'mine'
    )}>
      <div className="flex-1 flex items-center">
        <button
          type="button"
          onClick={handlePlayButton}
          disabled={isLoading}
          className={cn(
            "appearance-none cursor-pointer bg-none border-0 p-0",
            isMine ? 'px-2' : 'pr-2 pl-1',
            isLoading ? 'pointer-events-none' : ''
          )}
        >
          {isLoading ? (
            <Loader2 size={38} className={cn("animate-spin", playPauseIconColor)} />
          ) : isPlaying ? (
            <Pause size={38} className={cn(playPauseIconColor, 'opacity-80')} />
          ) : (
            <Play size={38} className={cn(playPauseIconColor, 'opacity-80')} />
          )}
        </button>

        <div className="flex-1 flex flex-col relative pb-0.5">
          <div className="flex-1 flex items-center relative h-8"> {/* Increased height for waveform */}
            {/* Waveform bars */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 pointer-events-none">
              {waveformHeights.map((height, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{
                    height: `${height}px`,
                    backgroundColor: i / waveformHeights.length * 100 < percentPlayed ? 'rgb(156 163 175)' : 'rgba(156, 163, 175, 0.4)', // gray-400 for played, gray-400/40 for unplayed
                    transform: `translateY(${height / 2}px)` // Center the bars vertically
                  }}
                ></div>
              ))}
            </div>
            <input
              ref={sliderRef}
              dir="ltr"
              type="range"
              min="0"
              max="100"
              value={percentPlayed}
              onChange={handleSliderChange}
              className={cn(
                "flex-1 appearance-none bg-transparent border-0 outline-none w-full relative z-10", // z-10 to be above waveform
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:-mt-[0.2rem]",
                "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:-mt-[0.2rem]",
                // Make the track transparent as the waveform will be the visual track
                "[&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-[0.24rem] [&::-webkit-slider-runnable-track]:rounded-full",
                "[&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-[0.24rem] [&::-moz-range-track]:rounded-full"
              )}
            />
          </div>
          <div className={cn("flex items-center justify-between text-xs", messageTimeColor)}>
            <div className="current-time">{formatTimeToDisplay(currentTime)}</div>
            <div className="flex items-center">
              <div className="time">{formatTimeToDisplay(duration)}</div>
              {isMine && <CheckCheck size={16} className={cn("ml-1", progressDotColor)} />} {/* Checkmark should also be blue */}
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "relative w-14 h-14",
        isMine ? 'ml-0' : 'ml-4'
      )}>
        <img
          src={senderAvatar}
          alt="Avatar"
          className="w-14 h-14 rounded-full object-cover bg-white/5"
        />
        <Mic
          size={26}
          className={cn(
            "absolute bottom-0",
            progressDotColor, // Mic icon is blue
            isMine ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2',
            "drop-shadow-[0_0_0_#262d31] shadow-[#262d31] text-shadow-sm" // Simulate text-shadow for background color
          )}
          style={{ textShadow: `-1px -1px 0 ${isMine ? '#056162' : '#262d31'}, 1px -1px 0 ${isMine ? '#056162' : '#262d31'}, -1px 1px 0 ${isMine ? '#056162' : '#262d31'}, 1px 1px 0 ${isMine ? '#056162' : '#262d31'}` }}
        />
      </div>
    </div>
  );
};