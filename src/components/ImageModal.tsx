import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  onClose: () => void;
}

export const ImageModal = ({ src, onClose }: ImageModalProps) => {
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-down"
      onClick={onClose}
      style={{ animationDuration: '0.3s' }}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      <div className="relative max-w-full max-h-full">
        <img
          src={src}
          alt="Visualização ampliada"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={handleImageClick}
        />
      </div>
    </div>
  );
};