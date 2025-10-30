import { MessageSquare } from 'lucide-react';

interface GroupInviteMessageProps {
  onViewClick?: () => void;
  groupName: string;
  inviteLink: string;
  description: string;
  buttonText: string;
}

export const GroupInviteMessage = ({ onViewClick, groupName, inviteLink, description, buttonText }: GroupInviteMessageProps) => {
  const handleLinkClick = () => {
    if (onViewClick) {
      onViewClick();
    } else {
      window.open(inviteLink, '_blank');
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#4F4C7A] text-gray-100 shadow-sm overflow-hidden">
      <div className="p-2 px-3 flex items-center gap-3 bg-black/10">
        <div className="w-12 h-12 bg-[#FFC72C] rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare size={28} className="text-[#2C2A4A]" />
        </div>
        <div className="text-left flex-grow">
          <p className="font-semibold">{groupName}</p>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>
      
      <div className="p-2 px-3 text-left">
        <p className="text-sm">
          Acesse este link para entrar no grupo:
          <br />
          <span className="text-[#FFC72C] break-all">{inviteLink}</span>
        </p>
      </div>

      <div className="border-t border-white/10">
        <button
          onClick={handleLinkClick}
          className="w-full text-center py-2.5 px-3 text-[#FFC72C] hover:bg-black/10 transition-colors text-sm font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};