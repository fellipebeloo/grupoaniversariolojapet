import { ArrowRight } from 'lucide-react';

export const CtaButton = () => {
  const handleClick = () => {
    console.log('cta_checkout_clicked');
    window.location.href = 'https://pay.kiwify.com.br/m9JXKJM';
  };

  return (
    <div className="flex flex-col max-w-[85%] w-full">
      <button
        onClick={handleClick}
        className="w-full text-center p-4 rounded-lg bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 animate-shake"
        style={{ animationIterationCount: 3, animationDuration: '0.5s' }}
      >
        <div className="flex items-center justify-center gap-2">
          <span>Quero meu Relatório + Acesso ao H.I.T.S.</span>
          <ArrowRight size={24} />
        </div>
      </button>
    </div>
  );
};