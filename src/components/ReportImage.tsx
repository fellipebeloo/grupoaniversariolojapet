import { FileText, Lock } from 'lucide-react';

export const ReportImage = ({ userName }: { userName: string }) => {
  return (
    <div className="flex flex-col max-w-[85%] w-full rounded-lg bg-[#2a3942] text-gray-100 shadow-lg overflow-hidden p-4 border border-gray-600">
      <div className="flex items-center gap-3 mb-3">
        <FileText size={32} className="text-green-400" />
        <div>
          <p className="font-bold text-lg text-white">Relatório Pochete Teimosa</p>
          <p className="text-sm text-gray-400">Diagnóstico Exclusivo para {userName}</p>
        </div>
      </div>
      <div className="bg-black/20 rounded-md p-4 text-center">
        <Lock size={24} className="text-yellow-400 mx-auto mb-2" />
        <p className="font-semibold text-yellow-400">Conteúdo Personalizado</p>
        <p className="text-xs text-gray-300">Sua análise está pronta e aguardando liberação.</p>
      </div>
    </div>
  );
};