import React from 'react';

const groupMessages = [
  { sender: 'Vanessa R.', text: 'Gente, 3 semanas de treino e minha barriga já tá muito mais seca 😭 Nunca achei que ia ver diferença tão rápido!', color: 'text-orange-400' },
  { sender: 'Jéssica L.', text: 'Eu só tenho 15 minutos por dia e mesmo assim tá funcionando. Tô chocada com o quanto minha roupa voltou a servir.', color: 'text-pink-400' },
  { sender: 'Tati M.', text: 'Tava quase desistindo de treinar... A metodologia da Ale me deu motivação e resultado REAL!', color: 'text-purple-400' },
  { sender: 'Luciana S.', text: 'Nunca imaginei emagrecer em casa. O tal do H.I.T.S. é tiro certo mesmo 🔥', color: 'text-teal-400' },
];

const GroupMessage = ({ sender, text, color }: { sender: string, text: string, color: string }) => (
  <div className="bg-[#202c33] rounded-xl p-2 px-3 max-w-[90%] self-start shadow-md">
    <p className={`text-sm font-semibold ${color} mb-1`}>{sender}</p>
    <p className="text-sm text-gray-100 whitespace-pre-wrap">{text}</p>
  </div>
);

export const GrupoWhatsApp = () => {
  return (
    <div className="space-y-3 flex flex-col">
      {groupMessages.map((msg, index) => (
        <GroupMessage key={index} sender={msg.sender} text={msg.text} color={msg.color} />
      ))}
    </div>
  );
};