import { Tag, Zap } from 'lucide-react';

export const OfferCard = () => {
  return (
    <div className="flex flex-col max-w-[85%] w-full rounded-lg bg-gradient-to-br from-green-800 to-green-900 text-white shadow-2xl overflow-hidden p-4 border-2 border-green-500">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={20} />
        <p className="font-bold text-lg">Acesso Promocional Liberado</p>
      </div>
      
      <div className="text-center my-2">
        <p className="text-lg line-through text-gray-300">De R$197</p>
        <p className="text-5xl font-bold text-yellow-300 my-1">R$67<span className="text-lg font-medium text-gray-200"> à vista</span></p>
        <p className="font-semibold">OU 12x de R$6,93</p>
      </div>

      <div className="mt-4 text-center bg-yellow-300/10 border border-yellow-300/20 rounded-lg p-2 text-sm text-yellow-200 flex items-center justify-center gap-2">
        <Zap size={16} />
        <span>Oferta por tempo limitado!</span>
      </div>
    </div>
  );
};