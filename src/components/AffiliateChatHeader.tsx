import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AffiliateChatHeader = () => {
  return (
    <header className="bg-[#202c33] p-4 flex items-center border-b border-gray-700">
      <Avatar className="w-10 h-10 mr-3">
        <AvatarImage src="/lojapet.png" alt="Loja Pet" />
        <AvatarFallback>LP</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-white">Loja Pet</p>
        <p className="text-sm text-gray-400">Black Friday 🐾</p>
      </div>
    </header>
  );
};