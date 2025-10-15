import { MessageSquare } from 'lucide-react';

interface GroupInviteMessageProps {
  onViewClick: () => void;
}

export const GroupInviteMessage = ({ onViewClick }: GroupInviteMessageProps) => {
  return (
    <div className="flex flex-col rounded-lg bg-[#202c33] text-gray-100 shadow-sm overflow-hidden"> {/* Removido max-w-[70%] */}
      <div className="p-2 px-3 flex items-center gap-3 bg-black/10">
        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare size={28} className="text-white" />
        </div>
        <div className="text-left flex-grow">
          <p className="font-semibold">#12 - Guerrilheiras do H.I.T.S. Fitness</p>
          <p className="text-sm text-gray-400">Convite de conversa em grupo</p>
        </div>
      </div>
      
      <div className="p-2 px-3 text-left">
        <p className="text-sm">
          Acesse este link para entrar no meu grupo do WhatsApp:
          <br />
          <span className="text-sky-400">https://chat.whatsapp.com/HjJCFypdUGd6qiRsilvIV4</span>
        </p>
      </div>

      <div className="border-t border-white/10">
        <button
          onClick={onViewClick}
          className="w-full text-center py-2.5 px-3 text-sky-400 hover:bg-black/10 transition-colors text-sm font-medium"
        >
          Ver grupo
        </button>
      </div>
    </div>
  );
};