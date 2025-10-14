"use client";

import React from 'react';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullScreenPromptProps {
  onEnterFullScreen: () => void;
}

export const FullScreenPrompt = ({ onEnterFullScreen }: FullScreenPromptProps) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white p-8 animate-fade-in-down" style={{ animationDuration: '0.5s' }}>
      <div className="text-center">
        <Maximize size={64} className="mx-auto mb-6 text-green-400" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Experiência Imersiva</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Para uma experiência completa e sem distrações, ative o modo tela cheia.
        </p>
        <Button
          onClick={onEnterFullScreen}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xl px-10 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Iniciar Experiência 🔥
        </Button>
      </div>
    </div>
  );
};