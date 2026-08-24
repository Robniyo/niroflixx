import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  transition?: 'fade' | 'slide';
  autoPlayInterval?: number;
  className?: string;
}

export default function Carousel({
  items,
  renderItem,
  transition = 'slide',
  autoPlayInterval = 10000,
  className = '',
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => setCurrent(prev => (prev + 1) % items.length);
  const prev = () => setCurrent(prev => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, items.length, autoPlayInterval]);

  if (items.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div
        className={`flex transition-transform duration-500 ease-in-out ${
          transition === 'slide' ? '' : 'relative'
        }`}
        style={
          transition === 'slide'
            ? { transform: `translateX(-${current * 100}%)` }
            : undefined
        }
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`w-full flex-shrink-0 ${
              transition === 'fade'
                ? `absolute inset-0 transition-opacity duration-700 ${
                    index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`
                : ''
            }`}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white text-secondary-700 rounded-full flex items-center justify-center shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-white text-secondary-700 rounded-full flex items-center justify-center shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'bg-primary-600 w-6' : 'bg-secondary-300 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}