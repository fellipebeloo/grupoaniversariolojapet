import React from 'react';

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
        className={`max-w-[70%] rounded-2xl shadow-sm p-3 border ${
          isUser 
            ? 'bg-[#134e37] text-white border-transparent' 
            : 'bg-[#252626] text-gray-100 border-gray-700'
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
        
        <div className="text-sm">
          {texto}
        </div>
        
        {/* Reações e horário */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex -space-x-1">
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
          <p className={`text-xs ${isUser ? 'text-white/80' : 'text-gray-400'}`}>
            {horario}
          </p>
        </div>
      </div>
    </div>
  );
}