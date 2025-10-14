import { Mic, Send } from 'lucide-react';

export const StaticChatInput = () => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1">
        <div className="w-full bg-[#2a3942] rounded-full px-4 py-2.5 text-gray-400 text-sm italic">
          Você não pode enviar mensagens para este grupo
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button type="button" className="text-gray-500 p-2" disabled>
          <Mic size={24} />
        </button>
        <button type="submit" className="bg-gray-600 text-white p-2 rounded-full" disabled>
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};