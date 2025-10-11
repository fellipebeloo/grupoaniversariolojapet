import { MessageSquare } from 'lucide-react';

interface GroupInviteMessageProps {
  onViewClick: () => void;
}

export const GroupInviteMessage = ({ onViewClick }: GroupInviteMessageProps) => {
  return (
    <div className="flex items-end gap-2 justify-start">
      <img
        src="/alessandra.jpg"
        alt="Alessandra"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="max-w-[70%] rounded-lg bg-[#202c33] text-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-2 px-3 flex items-center gap-3 bg-black/10">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageSquare size={28} className="text-white" />
          </div>
          <div>
            <p className="font-semibold">Mulheres que venceram a pochete teimosa 💬</p>
            <p className="text-sm text-gray-400">Convite de conversa em grupo</p>
          </div>
        </div>
        
        <div className="p-2 px-3">
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
    </div>
  );
};