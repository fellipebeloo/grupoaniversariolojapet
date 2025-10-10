import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ChatHeader = () => {
  return (
    <div className="bg-white p-4 flex items-center border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <Avatar className="w-10 h-10 mr-3">
        <AvatarImage src="https://i.pravatar.cc/150?u=alessandra" alt="Alessandra" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">Alessandra</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
      </div>
    </div>
  );
};