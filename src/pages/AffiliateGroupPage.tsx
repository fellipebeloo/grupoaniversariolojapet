"use client";

import React from 'react';
import { GroupInviteMessage } from '@/components/GroupInviteMessage';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AffiliateGroupPage = () => {

  // Configurações do Grupo de Afiliados
  const BLACKFRIDAY_GROUP = {
    name: 'GRUPO VIP LOJA PET COPA DO MUNDO',
    link: 'https://chat.whatsapp.com/L3wNROkDOCIEzETkmXa1I5',
    description: 'Ofertas Exclusivas - Copa do Mundo ⚽',
    buttonText: 'Ver Grupo',
  };

  const handleJoinGroupClick = () => {
    // Dispara o evento de Lead do Facebook Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
    window.open(BLACKFRIDAY_GROUP.link, '_blank');
  };

  return (
    <div
      className="h-dvh w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="h-full w-full bg-black/75 flex flex-col items-center justify-center p-4">

        <header className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-[#009739]">
            <AvatarImage src="/lojapet-copa.png" alt="Loja Pet" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-white">Você foi convidado! 🥳</h1>
          <p className="text-gray-300">Participe do nosso grupo VIP e receba ofertas exclusivas.</p>
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
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-green-950 font-extrabold rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:opacity-90 transition-transform transform hover:scale-105 text-lg animate-shake border-b-4 border-yellow-600 uppercase tracking-wide"
          >
            🏆 Entrar no Grupo VIP Copa do Mundo
          </button>
        </div>

      </div>
    </div>
  );
};

export default AffiliateGroupPage;