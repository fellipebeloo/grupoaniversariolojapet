import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlessandraInfoModal } from "./AlessandraInfoModal"; // Importar o novo componente

export const ChatHeader = () => {
  return (
    <AlessandraInfoModal>
      <header className="bg-[#202c33] p-4 flex items-center border-b border-gray-700 cursor-pointer">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src="/alessandra.jpg" alt="Alessandra" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-white">Alessandra</p>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </header>
    </AlessandraInfoModal>
  );
};