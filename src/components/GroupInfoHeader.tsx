import { Users, Info, UserPlus } from 'lucide-react';

export const GroupInfoHeader = () => {
  return (
    <div className="bg-[#202c33] rounded-lg p-6 text-center text-sm text-gray-400 mb-4 shadow-lg">
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
          <Users size={56} className="text-gray-300" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">
        Você entrou usando um link de convite
      </h2>
      <p className="mb-4">
        54 membros · Criado por Alessandra
      </p>
      <p className="text-white/90 mb-6 text-base">
        Este é o grupo exclusivo para mulheres que decidiram vencer a pochete teimosa e destravar a queima de gordura.
      </p>
      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 border border-gray-500/50 hover:bg-gray-700/40 transition-colors">
          <Info size={20} className="text-green-400" />
          <span className="text-green-400 font-medium">Dados do grupo</span>
        </button>
        <button className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 border border-gray-500/50 hover:bg-gray-700/40 transition-colors">
          <UserPlus size={20} className="text-green-400" />
          <span className="text-green-400 font-medium">Adicionar membros</span>
        </button>
      </div>
    </div>
  );
};