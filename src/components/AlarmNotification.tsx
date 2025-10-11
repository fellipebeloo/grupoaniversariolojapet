import { AlarmClock, Bed, X } from 'lucide-react';

interface AlarmNotificationProps {
  onDismiss: () => void;
}

export const AlarmNotification = ({ onDismiss }: AlarmNotificationProps) => {
  return (
    <div className="bg-black rounded-full p-2 flex items-center justify-between w-full max-w-sm mx-auto mb-6 animate-fade-in-down">
      <div className="flex items-center gap-3">
        <AlarmClock size={24} className="text-orange-400 ml-2" />
        <div className="text-orange-400">
          <span className="font-semibold">Alarm</span>
          <span className="ml-3 text-sm">7:45 AM</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mr-1">
        <button className="p-2 rounded-full bg-orange-900/50 hover:bg-orange-900/80 transition-colors">
          <Bed size={18} className="text-orange-300" />
        </button>
        <button onClick={onDismiss} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
          <X size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};