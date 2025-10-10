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
}

export function MensagemBalao({
  id,
  texto,
  horario,
  remetente,
  tipo,
  conteudo,
  reacoes
}: MensagemBalaoProps) {
  const isUser = remetente === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar do remetente (não-usuário) */}
      {!isUser && (
        <img
          src="/alessandra.jpg"
          alt={remetente}
          className="w-8 h-8 rounded-full self-end mr-2 object-cover"
        />
      )}

      {/* Balão da mensagem */}
      <div 
        className={`max-w-[70%] rounded-xl shadow-sm p-2 px-3 ${
          isUser 
            ? 'bg-[#005c4b] text-white' 
            : 'bg-[#202c33] text-gray-100'
        }`}
      >
        {/* Nome do remetente (não-usuário) */}
        {!isUser && (
          <p className="text-sm font-semibold text-green-400 mb-1">{remetente}</p>
        )}
        
        {/* Conteúdo da mensagem */}
        {tipo === 'imagem' && conteudo && (
          <img
            src={typeof texto === 'string' ? texto : 'image'}
            alt={typeof texto === 'string' ? texto : 'image'}
            className="rounded-lg mb-2 w-full"
          />
        )}
        
        <div className="flex flex-wrap items-baseline">
          <span className="text-sm mr-2">{texto}</span>
          
          {/* Horário e status */}
          <span className="flex-shrink-0 ml-auto pl-2">
            <span className="flex items-center whitespace-nowrap">
              <div className="flex -space-x-1 mr-2">
                {reacoes?.map((reacao, index) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs border dark:border-gray-600 shadow-sm flex items-center gap-1"
                  >
                    <span>{reacao.emoji}</span>
                    <span className="text-gray-600 dark:text-gray-300">{reacao.quantidade}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xs ${isUser ? 'text-gray-300/80' : 'text-gray-400'}`}>
                {horario}
              </p>
              {isUser && (
                <CheckCheck size={16} className="ml-1 text-blue-400" />
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}