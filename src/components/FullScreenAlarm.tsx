import { Button } from '@/components/ui/button';

interface FullScreenAlarmProps {
  onDismiss: () => void;
}

export const FullScreenAlarm = ({ onDismiss }: FullScreenAlarmProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white p-8 animate-fade-in-down" style={{ animationDuration: '0.5s' }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-8xl font-thin mb-4 tracking-wider">07:00</h1>
        <h2 className="text-5xl font-thin mb-20 tracking-wider">Alarme</h2>
        <Button
          onClick={onDismiss}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-2xl rounded-full px-24 py-5 h-auto"
        >
          Parar
        </Button>
      </div>
      <div className="pb-8">
        <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white rounded-full px-12 py-4 text-lg">
          Soneca
        </Button>
      </div>
    </div>
  );
};