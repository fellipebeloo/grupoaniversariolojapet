import React, { useRef, useEffect, useState } from 'react';
import Hammer from 'hammerjs';
import { CheckCheck, CornerUpLeft } from 'lucide-react';

interface MensagemBalaoProps {
  id: string;
  texto: React.ReactNode;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio' | 'custom-component';
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
  tipo,
  options,
  onOptionClick
}: MensagemBalaoProps) {
  const isUser = remetente === 'user';
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    if (!swipeContainerRef.current) return;

    const mc = new Hammer(swipeContainerRef.current);
    mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 20 });

    mc.on('panstart', () => {
      setIsPanning(true);
    });

    mc.on('pan', (ev) => {
      const newTranslateX = Math.max(-80, Math.min(80, ev.deltaX));
      if ((isUser && newTranslateX < 0) || (!isUser && newTranslateX > 0)) {
        setTranslateX(newTranslateX);
      }
    });

    mc.on('panend', (ev) => {
      setIsPanning(false);
      if (Math.abs(ev.deltaX) > 60) {
        console.log('Replying to message:', texto);
        // A lógica para responder a mensagem seria acionada aqui
      }
      setTranslateX(0);
    });

    return () => {
      mc.destroy();
    };
  }, [isUser, texto]);

  // Se o tipo for 'audio' ou 'custom-component', renderiza o conteúdo diretamente com o avatar
  if (tipo === 'audio' || tipo === 'custom-component') {
    return (
      <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <img
            src="/alessandra.jpg"
            alt={remetente}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        {texto} {/* Renderiza o WhatsAppAudioPlayer ou o componente customizado diretamente */}
      </div>
    );
  }

  // Para outros tipos de mensagem (texto, imagem), renderiza a bolha padrão
  return (
    <div className="relative">
      <div
        className={`absolute top-0 bottom-0 flex items-center justify-center w-16 ${
          isUser ? 'right-0' : 'left-0'
        }`}
        style={{ opacity: Math.min(Math.abs(translateX) / 60, 1) }}
      >
        <CornerUpLeft size={24} className="text-gray-300" />
      </div>

      <div
        ref={swipeContainerRef}
        style={{ transform: `translateX(${translateX}px)` }}
        className={!isPanning ? 'transition-transform duration-300 ease-out' : ''}
      >
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
                <div className="text-base mr-2">{texto}</div> {/* Alterado de text-sm para text-base */}

                <div className="flex-shrink-0 ml-auto pl-2 self-end">
                  <span className="flex items-center whitespace-rap">
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
      </div>
    </div>
  );
}