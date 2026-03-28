
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/helpers';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerView?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
}

export function Carousel<T>({
  items,
  renderItem,
  itemsPerView = 3,
  autoPlay = false,
  autoPlayInterval = 5000,
  className,
  showIndicators = true,
  showArrows = true,
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = Math.max(Math.ceil(items.length / itemsPerView) - 1, 0);

  const startAutoPlay = () => {
    if (!autoPlay) return;
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  React.useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [autoPlay, autoPlayInterval]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides : prev - 1));
    stopAutoPlay();
    startAutoPlay();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === totalSlides ? 0 : prev + 1));
    stopAutoPlay();
    startAutoPlay();
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    stopAutoPlay();
    startAutoPlay();
  };

  const startIndex = currentIndex * itemsPerView;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerView);

  const slideVariants = {
    enter: {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    },
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Carousel container */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(itemsPerView, visibleItems.length)}, 1fr)` }}>
              {visibleItems.map((item, index) => (
                <motion.div
                  key={startIndex + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderItem(item, startIndex + index)}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {showArrows && totalSlides > 0 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'bg-primary w-8 h-2'
                  : 'bg-zinc-700 w-2 h-2 hover:bg-zinc-600'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;
