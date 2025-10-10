import React from 'react';

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
        {/* Lado Esquerdo - Clips e Emoji */}
        <div className="flex gap-2">
          <button type="button" className="text-gray-400 hover:text-gray-200 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button type="button" className="text-gray-400 hover:text-gray-200 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button type="submit" className="bg-[#00a884] text-white p-2 rounded-full hover:bg-[#008f6f] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};