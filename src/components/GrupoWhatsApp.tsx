import React, { useState } from 'react';
import { ImageGalleryModal } from './ImageGalleryModal';

const groupMessages = [
  { sender: 'Vanessa R.', text: 'Gente, 3 semanas de treino e minha barriga já tá muito mais seca 😭 Nunca achei que ia ver diferença tão rápido!', color: 'text-orange-400', image: '/testimonial-vanessa.png', time: '09:15' },
  { sender: 'Jéssica L.', text: 'Eu só tenho 15 minutos por dia e mesmo assim tá funcionando. Tô chocada com o quanto minha roupa voltou a servir.', color: 'text-pink-400', image: '/testimonial-jessica.png', time: '09:22' },
  { sender: 'Tati M.', text: 'Tava quase desistindo de treinar... A metodologia da Ale me deu motivação e resultado REAL!', color: 'text-purple-400', image: '/testimonial-tati.png', time: '09:28' },
  { sender: 'Luciana S.', text: 'Nunca imaginei emagrecer em casa. O tal do H.I.T.S. é tiro certo mesmo 🔥', color: 'text-teal-400', image: '/testimonial-luciana.png', time: '09:41' },
  { sender: 'Carla M.', text: 'Meninas, olhem isso! A pochete sumindo em tempo recorde!', color: 'text-yellow-400', image: '/testimonial-extra1.png', time: '10:03' },
  { sender: 'Bruna P.', text: 'Nem acredito que sou eu na segunda foto. Obrigada Ale!', color: 'text-red-400', image: '/testimonial-extra2.png', time: '10:17' },
  { sender: 'Fernanda C.', text: '15kg a menos e contando! Bora arrochar que ainda não cheguei no meu objetivo 🚀', color: 'text-indigo-400', image: '/testimonial-extra3.jpg', time: '10:35' },
  { sender: 'Mariana A.', text: 'A diferença nas costas e na cintura é gritante. Foco total!', color: 'text-rose-400', image: '/testimonial-extra4.png', time: '11:02' },
];

const galleryItems = groupMessages.filter(msg => msg.image);

const GroupMessage = ({ sender, text, color, image, time, onImageClick }: { sender: string, text: string, color: string, image?: string, time: string, onImageClick: (src: string) => void }) => (
  <div className="bg-[#202c33] rounded-xl max-w-[90%] self-start shadow-md overflow-hidden">
    <div className="p-2 px-3">
      <p className={`text-sm font-semibold ${color} mb-2`}>{sender}</p>
      {image && (
        <button 
          onClick={() => onImageClick(image)} 
          className="w-full aspect-square block cursor-pointer focus:outline-none -mx-3 mb-2 rounded-lg overflow-hidden"
        >
          <img src={image} alt={`Depoimento de ${sender}`} className="w-full h-full object-cover" />
        </button>
      )}
      <div className="relative">
        <p className="text-sm text-gray-100 whitespace-pre-wrap pr-12">{text}</p>
        <div className="absolute bottom-0 right-0">
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  </div>
);

export const GrupoWhatsApp = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleImageClick = (src: string) => {
    const imageIndex = galleryItems.findIndex(item => item.image === src);
    if (imageIndex !== -1) {
      setInitialIndex(imageIndex);
      setGalleryOpen(true);
    }
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
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
            time={msg.time}
            onImageClick={handleImageClick}
          />
        ))}
      </div>
      {galleryOpen && (
        <ImageGalleryModal 
          items={galleryItems.map(item => ({
            src: item.image!,
            sender: item.sender,
            text: item.text,
            color: item.color,
          }))}
          initialIndex={initialIndex} 
          onClose={handleCloseGallery} 
        />
      )}
    </>
  );
};