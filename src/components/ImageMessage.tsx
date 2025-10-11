import React from 'react';

interface ImageMessageProps {
  src: string;
  alt: string;
  horario: string;
}

export const ImageMessage = ({ src, alt, horario }: ImageMessageProps) => {
  return (
    <div className="flex items-end gap-2 justify-start">
      <img
        src="/alessandra.jpg"
        alt="Alessandra"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="relative max-w-[70%]">
        <img src={src} alt={alt} className="rounded-lg" />
        <div className="absolute bottom-1 right-2 bg-black/50 rounded px-1 py-0.5">
          <span className="flex items-center whitespace-nowrap">
            <p className="text-xs text-gray-200">{horario}</p>
          </span>
        </div>
      </div>
    </div>
  );
};