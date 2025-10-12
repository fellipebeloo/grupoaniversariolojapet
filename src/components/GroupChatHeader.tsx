import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupChatHeaderProps {
  onBack: () => void;
}

export const GroupChatHeader = ({ onBack }: GroupChatHeaderProps) => {
  return (
    <header className="bg-[#202c33] p-4 flex items-center border-b border-gray-700">
      <button onClick={onBack} className="text-white mr-4">
        <ArrowLeft size={24} />
      </button>
      <Avatar className="w-10 h-10 mr-3">
        <AvatarImage src="/alessandra.jpg" alt="Grupo" />
        <AvatarFallback>G</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0"> {/* Adicionado flex-1 e min-w-0 aqui */}
        <p className="font-semibold text-white truncate">#12 - Guerrilheiras do H.I.T.S. Fitness</p>
        <p className="text-sm text-gray-400 truncate">Alessandra, Vanessa R., Jéssica L., Tati M., e mais 50</p>
      </div>
    </header>
  );
};