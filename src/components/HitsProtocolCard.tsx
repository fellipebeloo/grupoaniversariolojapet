import { Zap } from 'lucide-react';

const AnimatedLine = ({ delay, children }: { delay: string, children: React.ReactNode }) => (
  <div 
    className="opacity-0 animate-fade-in-down" 
    style={{ animationDelay: delay, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

export const HitsProtocolCard = () => {
  return (
    <div className="flex flex-col max-w-[85%] w-full rounded-lg bg-[#202c33] text-gray-100 shadow-sm overflow-hidden p-4">
      <AnimatedLine delay="0s">
        <div className="text-center font-bold text-2xl mb-4 text-yellow-300 flex items-center justify-center gap-2">
          <Zap size={24} className="text-yellow-400" />
          PROTOCOLO H.I.T.S.
        </div>
      </AnimatedLine>
      
      <div className="space-y-3 text-left">
        <AnimatedLine delay="0.5s">
          <p className="font-bold text-lg"><span className="text-yellow-400">H</span> – Hiper Estímulo Metabólico</p>
        </AnimatedLine>
        <AnimatedLine delay="1.0s">
          <p className="font-bold text-lg"><span className="text-yellow-400">I</span> – Intensidade sem Impacto</p>
        </AnimatedLine>
        <AnimatedLine delay="1.5s">
          <p className="font-bold text-lg"><span className="text-yellow-400">T</span> – Treino em Circuito <span className="text-gray-400 text-sm">(sem enrolação)</span></p>
        </AnimatedLine>
        <AnimatedLine delay="2.0s">
          <p className="font-bold text-lg"><span className="text-yellow-400">S</span> – Sequência de Secagem</p>
        </AnimatedLine>
      </div>
    </div>
  );
};