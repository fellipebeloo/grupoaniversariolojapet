import { Users } from 'lucide-react';

export const GroupInfoHeader = () => {
  return (
    <div className="bg-[#202c33] rounded-lg p-3 text-center text-sm text-gray-400 mb-4 shadow-lg max-w-xs mx-auto">
      <div className="flex justify-center mb-2">
        <div className="w-14 h-14 bg-gray-500 rounded-full flex items-center justify-center">
          <Users size={32} className="text-gray-300" />
        </div>
      </div>
      <h2 className="text-base font-semibold text-white mb-1">
        Você entrou usando um link de convite
      </h2>
      <p className="text-xs mb-2">
        54 membros · Criado por Alessandra
      </p>
      <p className="text-white/90 text-xs">
        Este é o grupo exclusivo para mulheres que decidiram vencer a pochete teimosa e destravar a queima de gordura.
      </p>
    </div>
  );
};