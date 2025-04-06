import React, { useState, useEffect } from 'react';

const Carousel = ({ images = [], autoPlayInterval = 3000, showDots = true, showArrows = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Default images if none provided
  const defaultImages = [
    { src: "/api/placeholder/800/400", alt: "Slide 1" },
    { src: "/api/placeholder/800/400", alt: "Slide 2" },
    { src: "/api/placeholder/800/400", alt: "Slide 3" },
  ];
  
  const displayImages = images.length > 0 ? images : defaultImages;
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  // Auto-play functionality
  useEffect(() => {
    if (autoPlayInterval) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlayInterval]);
  
  // Inline styles
  const styles = {
    carouselContainer: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '8px'
    },
    slidesContainer: {
      position: 'relative',
      height: '256px' // equivalent to h-64
    },
    slide: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transition: 'opacity 500ms ease-in-out'
    },
    activeSlide: {
      opacity: 1,
      zIndex: 10
    },
    inactiveSlide: {
      opacity: 0,
      zIndex: 0
    },
    image: {
      objectFit: 'cover',
      width: '100%',
      height: '100%'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      zIndex: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '50%',
      padding: '8px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      border: 'none',
      outline: 'none'
    },
    prevButton: {
      left: '16px'
    },
    nextButton: {
      right: '16px'
    },
    dotsContainer: {
      position: 'absolute',
      bottom: '16px',
      left: 0,
      right: 0,
      zIndex: 20,
      display: 'flex',
      justifyContent: 'center',
      gap: '8px'
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: 'rgba(128, 128, 128, 0.5)',
      border: 'none',
      cursor: 'pointer',
      outline: 'none'
    },
    activeDot: {
      backgroundColor: 'white'
    }
  };
  
  return (
    <div style={styles.carouselContainer}>
      {/* Main carousel container */}
      <div style={styles.slidesContainer}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              ...(index === currentIndex ? styles.activeSlide : styles.inactiveSlide)
            }}
          >
            <img
              src={image.src}
              alt={image.alt || `Slide ${index + 1}`}
              style={styles.image}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={prevSlide}
            style={{...styles.navButton, ...styles.prevButton}}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            style={{...styles.navButton, ...styles.nextButton}}
            aria-label="Next slide"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Dots navigation */}
      {showDots && (
        <div style={styles.dotsContainer}>
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                ...styles.dot,
                ...(index === currentIndex ? styles.activeDot : {})
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;