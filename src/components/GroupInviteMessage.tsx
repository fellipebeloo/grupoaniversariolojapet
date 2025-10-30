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
    <div className="flex flex-col rounded-lg bg-white text-gray-800 shadow-lg overflow-hidden">
      <div className="p-3 flex items-center gap-3 bg-gray-50">
        <div className="w-12 h-12 bg-[#dc395a] rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare size={28} className="text-white" />
        </div>
        <div className="text-left flex-grow">
          <p className="font-semibold text-gray-900">{groupName}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      
      <div className="p-3 text-left">
        <p className="text-sm text-gray-600">
          Acesse este link para entrar no grupo:
          <br />
          <span className="text-[#1a55a1] break-all font-medium">{inviteLink}</span>
        </p>
      </div>

      <div className="border-t border-gray-200">
        <button
          onClick={handleLinkClick}
          className="w-full text-center py-3 px-3 text-[#dc395a] hover:bg-gray-100 transition-colors text-sm font-bold"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};