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
          src={`https://i.pravatar.cc/150?u=alessandra`}
          alt={remetente}
          className="w-8 h-8 rounded-full self-end mr-2"
        />
      )}

      {/* Balão da mensagem */}
      <div 
        className={`max-w-[70%] ${
          isUser ? 'bg-[#5b96f7] text-white' : 'bg-white dark:bg-gray-800'
        } rounded-2xl shadow-sm p-3 border border-gray-100 dark:border-gray-700`}
      >
        {/* Nome do remetente (não-usuário) */}
        {!isUser && (
          <p className="text-sm font-semibold text-[#5b96f7] mb-1">{remetente}</p>
        )}
        
        {/* Conteúdo da mensagem */}
        {tipo === 'imagem' && conteudo && (
          <img
            src={conteudo}
            alt={typeof texto === 'string' ? texto : 'image'}
            className="rounded-lg mb-2 w-full"
          />
        )}
        
        <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
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
          <p className={`text-xs ${isUser ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {horario}
          </p>
        </div>
      </div>

      {/* Avatar do usuário */}
      {isUser && (
        <img
          src="https://i.pravatar.cc/150?img=30"
          alt="You"
          className="w-8 h-8 rounded-full self-end ml-2"
        />
      )}
    </div>
  );
}