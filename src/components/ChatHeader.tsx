import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ChatHeader = () => {
  return (
    <div className="flex items-center p-3 border-b bg-gray-50 dark:bg-gray-800 rounded-t-xl">
      <Avatar className="w-10 h-10 mr-3">
        <AvatarImage src="https://i.pravatar.cc/150?u=alessandra" alt="Alessandra" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">Alessandra</p>
        <p className="text-xs text-green-500">Online</p>
      </div>
    </div>
  );
};