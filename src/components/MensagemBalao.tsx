import React from 'react';
import { CheckCheck } from 'lucide-react';

interface MensagemBalaoProps {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio';
  conteudo?: string;
  reacoes?: Array<{
    emoji: string;
    quantidade: number;
  }>;
  options?: string[];
  onOptionClick?: (option: string) => void;
}

export function MensagemBalao({
  texto,
  horario,
  remetente,
  options,
  onOptionClick
}: MensagemBalaoProps) {
  const isUser = remetente === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img
          src="/alessandra.jpg"
          alt={remetente}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <div 
        className={`max-w-[70%] rounded-xl shadow-sm flex flex-col ${
          isUser 
            ? 'bg-[#005c4b] text-white' 
            : 'bg-[#202c33] text-gray-100'
        }`}
      >
        <div className="p-2 px-3">
          {!isUser && (
            <p className="text-sm font-semibold text-green-400 mb-1">{remetente}</p>
          )}
          
          <div className="flex flex-wrap items-baseline">
            <span className="text-sm mr-2">{texto}</span>
            
            <div className="flex-shrink-0 ml-auto pl-2 self-end">
              <span className="flex items-center whitespace-nowrap">
                <p className={`text-xs ${isUser ? 'text-gray-300/80' : 'text-gray-400'}`}>
                  {horario}
                </p>
                {isUser && (
                  <CheckCheck size={16} className="ml-1 text-blue-400" />
                )}
              </span>
            </div>
          </div>
        </div>

        {options && options.length > 0 && onOptionClick && (
          <div className="border-t border-white/10">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionClick(option)}
                className={`w-full text-center py-2.5 px-3 text-sky-400 hover:bg-black/10 transition-colors text-sm font-medium ${index > 0 ? 'border-t border-white/10' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}