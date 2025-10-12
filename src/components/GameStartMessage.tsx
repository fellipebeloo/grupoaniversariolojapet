import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

interface GameStartMessageProps {
    userName: string;
}

export const GameStartMessage = ({ userName }: GameStartMessageProps) => {
    return (
        <div className="flex flex-col max-w-[85%] w-full rounded-lg bg-[#202c33] text-gray-100 shadow-sm overflow-hidden p-4 text-center">
            <div className="font-bold text-lg mb-2 text-green-400 flex items-center justify-center gap-2">
                <Gamepad2 size={24} />
                Jogo da Vida Fitness
            </div>
            <p className="text-sm text-gray-300 mb-4">
                Clique abaixo para começar e descobrir se suas decisões estão travando seu corpo.
            </p>
            <Link to="/jogo" state={{ userName }}>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold w-full">
                    Começar o Jogo 🔥
                </Button>
            </Link>
        </div>
    );
};