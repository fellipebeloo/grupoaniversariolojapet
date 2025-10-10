import React from 'react';
import { Plus, Mic, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (e: React.FormEvent) => void;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  inputType: 'text' | 'tel';
}

export const ChatInput = ({ onSubmit, inputValue, onInputChange, placeholder, inputType }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-3">
        {/* Botão de Adicionar */}
        <button type="button" className="text-gray-400 hover:text-gray-200 p-2">
          <Plus size={24} />
        </button>

        {/* Campo de Input */}
        <div className="flex-1">
          <input
            type={inputType}
            placeholder={placeholder}
            value={inputValue}
            onChange={onInputChange}
            autoFocus
            className="w-full bg-[#2a3942] rounded-full px-4 py-2.5 focus:outline-none text-white placeholder-gray-400"
          />
        </div>

        {/* Lado Direito - Microfone e Enviar */}
        <div className="flex gap-2">
          <button type="button" className="text-gray-400 hover:text-gray-200 p-2">
            <Mic size={24} />
          </button>
          <button type="submit" className="bg-[#00a884] text-white p-2 rounded-full hover:bg-[#008f6f] transition-colors">
            <ArrowUp size={24} />
          </button>
        </div>
      </div>
    </form>
  );
};