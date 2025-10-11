import { Play } from 'lucide-react';

export const AudioMessage = () => {
  return (
    <div className="flex items-center gap-3 py-1">
      <img
        src="/alessandra.jpg"
        alt="Alessandra"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-grow flex items-center h-1 bg-gray-500/50 rounded-full">
        <div className="w-4/5 h-1 bg-white rounded-l-full"></div>
        <div className="w-3 h-3 bg-white rounded-full shadow -ml-1.5"></div>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-400 ml-2">0:42</span>
      </div>
    </div>
  );
};