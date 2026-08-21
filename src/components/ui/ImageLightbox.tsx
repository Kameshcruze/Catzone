import React, { useEffect, useState, TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps {
  images: string[];
  initialIdx: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIdx,
  isOpen,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(initialIdx);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIdx]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Swipe handlers
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-center z-50">
        <div className="text-white/60 font-mono text-xs sm:text-sm tracking-widest">
          {currentIdx + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Area with Swipe */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {/* Navigation Buttons (Desktop) */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-4 sm:inset-x-8 flex items-center justify-between pointer-events-none z-10 hidden sm:flex">
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="p-3 sm:p-4 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur-md pointer-events-auto transition-colors"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="p-3 sm:p-4 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur-md pointer-events-auto transition-colors"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            alt={`Gallery image ${currentIdx + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="max-w-full max-h-full object-contain select-none"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};
