import { GroupChatHeader } from './GroupChatHeader';
import { GroupInfoHeader } from './GroupInfoHeader';
import { GrupoWhatsApp } from './GrupoWhatsApp';
import { StaticChatInput } from './StaticChatInput';

interface GroupChatViewProps {
  onBack: () => void;
}

export const GroupChatView = ({ onBack }: GroupChatViewProps) => {
  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_auto] bg-[#0f1418] w-full">
      <GroupChatHeader onBack={onBack} />
      <div className="overflow-y-auto p-4">
        <GroupInfoHeader />
        <div className="space-y-4">
          <GrupoWhatsApp />
        </div>
      </div>
      <div className="p-4 bg-[#202c33] border-t border-gray-700">
        <StaticChatInput />
      </div>
    </div>
  );
};