import { GroupChatHeader } from './GroupChatHeader';
import { GroupInfoHeader } from './GroupInfoHeader';
import { GrupoWhatsApp } from './GrupoWhatsApp';
import { StaticChatInput } from './StaticChatInput';
import { Button } from '@/components/ui/button'; // Importando o componente Button

interface GroupChatViewProps {
  onBack: () => void;
}

export const GroupChatView = ({ onBack }: GroupChatViewProps) => {
  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_auto] bg-[#0f1418] w-full overflow-hidden">
      <GroupChatHeader onBack={onBack} />
      <div className="overflow-y-auto p-4">
        <GroupInfoHeader />
        <div className="space-y-4">
          <GrupoWhatsApp />
        </div>
      </div>
      <div className="p-4 bg-[#202c33] border-t border-gray-700 flex flex-col gap-3"> {/* Adicionado flex-col e gap-3 */}
        <StaticChatInput />
        <Button 
          onClick={onBack} 
          className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-bold py-2"
        >
          Voltar para a conversa com Alessandra
        </Button>
      </div>
    </div>
  );
};