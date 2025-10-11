import { AlarmClock, X } from 'lucide-react';

interface AlarmNotificationProps {
  onDismiss: () => void;
}

export const AlarmNotification = ({ onDismiss }: AlarmNotificationProps) => {
  return (
    <div className="bg-black rounded-full p-2 flex items-center justify-between w-full animate-fade-in-down shadow-lg">
      <div className="flex items-center gap-3">
        <AlarmClock size={32} className="text-orange-400 ml-2 animate-shake" />
        <div className="text-orange-400">
          <span className="font-semibold">Alarme</span>
          <span className="ml-3 text-sm">7:00 AM</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mr-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#3A290B] hover:bg-[#5A492B] transition-colors">
          <span className="font-bold text-sm text-orange-400 -translate-y-px">Zz</span>
        </button>
        <button onClick={onDismiss} className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <X size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};