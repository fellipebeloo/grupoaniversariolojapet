import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryItem {
  src: string;
  sender: string;
  text: string;
  color: string;
}

interface ImageGalleryModalProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageGalleryModal = ({ items, initialIndex, onClose }: ImageGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = useCallback(() => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, items.length]);

  const goToNext = useCallback(() => {
    const isLastImage = currentIndex === items.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious, onClose]);

  const currentItem = items[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50 animate-fade-in-down"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 text-white w-full flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-gray-700 ${currentItem.color.replace('text-', 'bg-').replace('-400', '-800/50')}`}>
            {currentItem.sender.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{currentItem.sender}</p>
            <p className="text-xs text-gray-400">no grupo #12 - Guerrilheiras</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:text-gray-300">
          <X size={28} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative p-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2 z-10"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>

        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <div className="flex-1 flex items-center justify-center w-full h-full min-h-0">
              <img
                src={currentItem.src}
                alt={`Depoimento de ${currentItem.sender}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-center text-white text-base flex-shrink-0 px-12">{currentItem.text}</p>
        </div>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2 z-10"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      </main>

      {/* Footer Thumbnail Carousel */}
      <footer className="w-full p-4 flex justify-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                currentIndex === index ? 'border-green-500' : 'border-transparent hover:border-gray-500'
              )}
            >
              <img src={item.src} alt={item.sender} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};