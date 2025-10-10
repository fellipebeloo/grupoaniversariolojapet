import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from 'react';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  content: React.ReactNode;
}

interface MensagemBalaoProps {
  message: Message;
}

export const MensagemBalao = ({ message }: MensagemBalaoProps) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 self-start">
          <AvatarImage src="https://i.pravatar.cc/150?u=alessandra" alt="Alessandra" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm ${isUser ? 'bg-emerald-200 dark:bg-emerald-800 text-gray-800 dark:text-gray-100 rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
        {message.content}
      </div>
    </div>
  );
};