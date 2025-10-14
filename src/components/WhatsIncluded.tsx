import { CheckCircle2, Gift } from 'lucide-react';

const IncludedItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <CheckCircle2 size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

export const WhatsIncluded = () => {
  return (
    <div className="flex flex-col max-w-[85%] w-full rounded-lg bg-[#2a3942] text-gray-200 shadow-lg overflow-hidden p-4 border border-gray-600">
      <h3 className="font-bold text-lg text-white mb-3 text-center">O que você vai receber:</h3>
      <ul className="space-y-2 text-sm">
        <IncludedItem>Acesso ao protocolo completo H.I.T.S.</IncludedItem>
        <IncludedItem>Relatório personalizado "Pochete Teimosa"</IncludedItem>
        <IncludedItem>Treinos rápidos, intensos e para fazer em casa</IncludedItem>
        <IncludedItem>Resultados visíveis em até 21 dias</IncludedItem>
        <IncludedItem>Grupo de suporte com outras alunas</IncludedItem>
        <li className="flex items-start gap-2 font-bold text-yellow-300 mt-3 pt-3 border-t border-gray-600">
          <Gift size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
          <span>Bônus surpresa liberado após a compra!</span>
        </li>
      </ul>
    </div>
  );
};