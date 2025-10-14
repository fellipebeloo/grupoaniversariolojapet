import { Users } from 'lucide-react';

export const SlotsRemaining = () => {
  return (
    <div className="flex flex-col max-w-[85%] w-full rounded-lg bg-red-900/70 text-white shadow-lg overflow-hidden p-3 border border-red-600 animate-pulse">
      <div className="flex items-center justify-center gap-3">
        <Users size={28} className="text-red-300" />
        <div>
          <p className="font-bold text-lg text-red-200">Vagas Restantes: 11</p>
          <p className="text-sm text-red-300">Acesso com valor promocional</p>
        </div>
      </div>
    </div>
  );
};