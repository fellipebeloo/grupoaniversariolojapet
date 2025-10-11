interface IphoneAlarmProps {
  onStop: () => void;
}

export const IphoneAlarm = ({ onStop }: IphoneAlarmProps) => {
  return (
    <div className="flex flex-col items-center justify-between h-full text-white text-center py-8">
      <div className="flex-grow flex flex-col items-center justify-center space-y-8">
        <div>
          <p className="text-8xl font-thin tracking-tight">7:30</p>
          <p className="text-xl text-gray-300">Tuesday, October 11</p>
        </div>
        <div className="space-y-4">
          <p className="text-2xl">Alarm</p>
          <button className="bg-orange-500 text-white font-semibold py-3 rounded-full text-lg w-48 shadow-lg hover:bg-orange-600 transition-colors">
            Snooze
          </button>
        </div>
      </div>
      <button 
        onClick={onStop}
        className="bg-gray-700/50 text-white font-semibold py-3 rounded-full text-lg w-full max-w-xs hover:bg-gray-600/50 transition-colors"
      >
        Stop
      </button>
    </div>
  );
};