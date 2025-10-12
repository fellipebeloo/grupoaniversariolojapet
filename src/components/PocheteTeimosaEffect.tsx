import { ArrowDown, Salad, Dumbbell, BrainCircuit, Angry, ShieldAlert } from 'lucide-react';

const CycleStep = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="bg-gray-700 p-2 rounded-full mb-1">
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-300">{label}</span>
  </div>
);

export const PocheteTeimosaEffect = () => {
  return (
    <div className="flex flex-col max-w-[85%] rounded-lg bg-[#202c33] text-gray-100 shadow-sm overflow-hidden p-3">
      <div className="text-center font-bold text-lg mb-4 text-red-400">
        O Ciclo do "Efeito Pochete Teimosa"
      </div>
      
      <div className="grid grid-cols-3 gap-y-4 gap-x-2 items-start justify-items-center">
        <CycleStep icon={<Salad size={20} className="text-green-400" />} label="Dieta Restritiva" />
        <div className="flex items-center justify-center h-full"><ArrowDown size={16} className="text-gray-500" /></div>
        <CycleStep icon={<Dumbbell size={20} className="text-blue-400" />} label="Treino Errado" />
        
        <CycleStep icon={<BrainCircuit size={20} className="text-purple-400" />} label="Estresse Aumenta" />
        <div className="flex items-center justify-center h-full"><ArrowDown size={16} className="text-gray-500" /></div>
        <CycleStep icon={<Angry size={20} className="text-orange-400" />} label="Frustração" />
      </div>

      <div className="flex justify-center my-3">
          <ArrowDown size={24} className="text-red-400 animate-bounce" />
      </div>

      <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <ShieldAlert size={24} className="text-red-300" />
          <p className="font-semibold text-red-300 text-base">CORPO TRAVA E RETÉM GORDURA</p>
        </div>
        <p className="text-sm text-red-300/80 mt-1">Modo de auto-proteção ativado!</p>
      </div>
    </div>
  );
};