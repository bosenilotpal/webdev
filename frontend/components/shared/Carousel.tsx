'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
}

export default function Carousel({ children, itemsPerView = 3 }: CarouselProps) {
  const effectiveItemsPerView = Math.min(
    itemsPerView,
    Math.max(children.length, 1)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const max = Math.max(0, children.length - effectiveItemsPerView);
    setMaxIndex(max);
    setCurrentIndex((prev) => Math.min(prev, max));
  }, [children.length, effectiveItemsPerView]);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const translateX = -(currentIndex * (100 / effectiveItemsPerView));
  const useCenteredTrack = children.length <= effectiveItemsPerView;

  return (
    <div className="carousel">
      <div className="carousel-container" ref={containerRef}>
        <div
          className={`carousel-track ${useCenteredTrack ? 'carousel-track--centered' : ''}`}
          style={{
            transform: useCenteredTrack ? undefined : `translateX(${translateX}%)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="carousel-item"
              style={{
                width: useCenteredTrack
                  ? `${100 / effectiveItemsPerView}%`
                  : `${100 / effectiveItemsPerView}%`,
                maxWidth: useCenteredTrack ? '360px' : undefined,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          className="carousel-button carousel-button-prev"
          onClick={goToPrev}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          className="carousel-button carousel-button-next"
          onClick={goToNext}
          aria-label="Next"
        >
          ›
        </button>
      )}

      <div className="carousel-pagination">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`carousel-pagination-dot ${
              index === currentIndex ? 'active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}




