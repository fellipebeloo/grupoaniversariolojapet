import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import React from 'react';

interface ChatInputProps {
  onSubmit: (e: React.FormEvent) => void;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  inputType: 'text' | 'tel';
}

export const ChatInput = ({ onSubmit, inputValue, onInputChange, placeholder, inputType }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center space-x-2">
      <Input
        type={inputType}
        placeholder={placeholder}
        value={inputValue}
        onChange={onInputChange}
        autoFocus
        className="bg-gray-100 dark:bg-gray-800"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};