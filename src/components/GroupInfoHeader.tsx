import { Users } from 'lucide-react';

export const GroupInfoHeader = () => {
  return (
    <div className="bg-[#202c33] rounded-lg p-4 text-center text-sm text-gray-400 mb-4 shadow-lg">
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
          <Users size={40} className="text-gray-300" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-white mb-1">
        Você entrou usando um link de convite
      </h2>
      <p className="mb-3">
        54 membros · Criado por Alessandra
      </p>
      <p className="text-white/90 text-sm">
        Este é o grupo exclusivo para mulheres que decidiram vencer a pochete teimosa e destravar a queima de gordura.
      </p>
    </div>
  );
};