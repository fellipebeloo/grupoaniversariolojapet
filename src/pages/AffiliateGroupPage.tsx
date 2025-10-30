"use client";

import React from 'react';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AffiliateGroupPage = () => {
  
  // Configurações do Grupo de Afiliados
  const BLACKFRIDAY_GROUP = {
    name: 'BLACK FRIDAY LOJA PET 🐾',
    link: 'https://chat.whatsapp.com/GKwPpq9VXKiJhaMEIYzfPM?mode=wwc',
    description: 'Grupo Exclusivo Black Friday',
    buttonText: 'Ver Grupo',
  };

  const handleJoinGroupClick = () => {
    window.open(BLACKFRIDAY_GROUP.link, '_blank');
  };

  return (
    <div 
      className="h-dvh w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="h-full w-full bg-black/75 flex flex-col items-center justify-center p-4">
        
        <header className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-[#dc395a]">
            <AvatarImage src="/lojapet.png" alt="Loja Pet" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-white">Você foi convidado!</h1>
          <p className="text-gray-300">Participe do nosso grupo exclusivo da Black Friday.</p>
        </header>

        <div className="w-full max-w-md">
          <GroupInviteMessage 
            groupName={BLACKFRIDAY_GROUP.name}
            inviteLink={BLACKFRIDAY_GROUP.link}
            description={BLACKFRIDAY_GROUP.description}
            buttonText={BLACKFRIDAY_GROUP.buttonText}
            onViewClick={handleJoinGroupClick}
          />
        </div>

        <div className="mt-8 w-full max-w-md">
          <button
            onClick={handleJoinGroupClick}
            className="w-full py-4 bg-[#dc395a] text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-transform transform hover:scale-105 text-lg animate-shake"
          >
            Entrar no Grupo Agora
          </button>
        </div>

      </div>
    </div>
  );
};

export default AffiliateGroupPage;