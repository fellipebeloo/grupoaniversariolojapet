import React, { useState } from 'react';
import { ImageModal } from './ImageModal';

const groupMessages = [
  { sender: 'Vanessa R.', text: 'Gente, 3 semanas de treino e minha barriga já tá muito mais seca 😭 Nunca achei que ia ver diferença tão rápido!', color: 'text-orange-400', image: '/testimonial-vanessa.png' },
  { sender: 'Jéssica L.', text: 'Eu só tenho 15 minutos por dia e mesmo assim tá funcionando. Tô chocada com o quanto minha roupa voltou a servir.', color: 'text-pink-400', image: '/testimonial-jessica.png' },
  { sender: 'Tati M.', text: 'Tava quase desistindo de treinar... A metodologia da Ale me deu motivação e resultado REAL!', color: 'text-purple-400', image: '/testimonial-tati.png' },
  { sender: 'Luciana S.', text: 'Nunca imaginei emagrecer em casa. O tal do H.I.T.S. é tiro certo mesmo 🔥', color: 'text-teal-400', image: '/testimonial-luciana.png' },
  { sender: 'Carla M.', text: 'Meninas, olhem isso! A pochete sumindo em tempo recorde!', color: 'text-yellow-400', image: '/testimonial-extra1.png' },
  { sender: 'Bruna P.', text: 'Nem acredito que sou eu na segunda foto. Obrigada Ale!', color: 'text-red-400', image: '/testimonial-extra2.png' },
  { sender: 'Fernanda C.', text: '15kg a menos e contando! Bora arrochar que ainda não cheguei no meu objetivo 🚀', color: 'text-indigo-400', image: '/testimonial-extra3.jpg' },
  { sender: 'Mariana A.', text: 'A diferença nas costas e na cintura é gritante. Foco total!', color: 'text-rose-400', image: '/testimonial-extra4.png' },
];

const GroupMessage = ({ sender, text, color, image, onImageClick }: { sender: string, text: string, color: string, image?: string, onImageClick: (src: string) => void }) => (
  <div className="bg-[#202c33] rounded-xl max-w-[90%] self-start shadow-md overflow-hidden">
    {image && (
      <button onClick={() => onImageClick(image)} className="w-full h-auto block cursor-pointer focus:outline-none">
        <img src={image} alt={`Depoimento de ${sender}`} className="w-full h-auto" />
      </button>
    )}
    <div className="p-2 px-3">
      <p className={`text-sm font-semibold ${color} mb-1`}>{sender}</p>
      <p className="text-sm text-gray-100 whitespace-pre-wrap">{text}</p>
    </div>
  </div>
);

export const GrupoWhatsApp = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="space-y-3 flex flex-col">
        {groupMessages.map((msg, index) => (
          <GroupMessage
            key={index}
            sender={msg.sender}
            text={msg.text}
            color={msg.color}
            image={msg.image}
            onImageClick={handleImageClick}
          />
        ))}
      </div>
      {selectedImage && (
        <ImageModal src={selectedImage} onClose={handleCloseModal} />
      )}
    </>
  );
};