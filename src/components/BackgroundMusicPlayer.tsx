import React, { useEffect, useRef } from 'react';

interface BackgroundMusicPlayerProps {
  isPlaying: boolean;
}

export const BackgroundMusicPlayer = ({ isPlaying }: BackgroundMusicPlayerProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillator1Ref = useRef<OscillatorNode | null>(null);
  const oscillator2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (isPlaying) {
      if (!audioContextRef.current) {
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = context;

          const gainNode = context.createGain();
          gainNode.gain.setValueAtTime(0, context.currentTime);
          gainNode.connect(context.destination);
          gainNodeRef.current = gainNode;

          const osc1 = context.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(100, context.currentTime); // A low C note
          osc1.connect(gainNode);
          oscillator1Ref.current = osc1;

          const osc2 = context.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(100.5, context.currentTime); // Slightly detuned for a chorus effect
          osc2.connect(gainNode);
          oscillator2Ref.current = osc2;

          osc1.start();
          osc2.start();

          // Fade in
          gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 2); // Fade in to a low volume
        } catch (e) {
          console.error("Web Audio API is not supported in this browser or failed to initialize.", e);
        }
      }
    } else {
      if (audioContextRef.current && gainNodeRef.current) {
        // Fade out and stop
        const context = audioContextRef.current;
        const gainNode = gainNodeRef.current;
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 1);
        
        setTimeout(() => {
            oscillator1Ref.current?.stop();
            oscillator2Ref.current?.stop();
            context.close();
            audioContextRef.current = null;
            oscillator1Ref.current = null;
            oscillator2Ref.current = null;
            gainNodeRef.current = null;
        }, 1000);
      }
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        oscillator1Ref.current?.stop();
        oscillator2Ref.current?.stop();
        audioContextRef.current.close().catch(e => console.error("Error closing AudioContext", e));
      }
    };
  }, []);

  return null; // This component does not render anything
};