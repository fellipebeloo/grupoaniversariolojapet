import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-4">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Jogo da Vida Fitness</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Descubra por que seu corpo trava e como destravar a queima de gordura.
        </p>
        <Link to="/funil">
          <Button size="lg" className="text-lg px-8 py-6">
            Começar o Desafio
          </Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;