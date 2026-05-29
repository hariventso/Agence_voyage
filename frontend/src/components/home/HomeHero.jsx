import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../../services/api';
import { getImageUrl } from '../../services/images';

const fallbackSlides = [
  {
    image: '/image/beach_sunset_hero.png',
    title: "Explor'île",
    subtitle: "Sur les traces des Malgaches",
    description: "Envie de découvrir Madagascar au-delà des sentiers battus ? Explor’île vous invite à vivre des expériences uniques, au croisement du tourisme culturel et de l’aventure. Nos voyages sont conçus à partir de recherches scientifiques, de savoirs locaux et de récits authentiques, pour vous offrir bien plus qu’un simple séjour : une véritable immersion au cœur de l’âme malgache.",
    buttonText: "Découvrir nos offres",
    link: "#destinations"
  },
  {
    image: '/image/isalo_destination.png',
    title: "Aventure Isalo",
    subtitle: "Randonnées et Canyons Spectaculaires",
    description: "Parcourez les paysages lunaires et les piscines naturelles du parc national de l''Isalo. Une immersion totale au milieu de canyons sculptés par le temps, de faune endémique et de savanes dorées, guidée par nos experts locaux.",
    buttonText: "Explorer les circuits",
    link: "#destinations"
  },
  {
    image: '/image/home_beach_hero.png',
    title: "Nosy Be & Sainte Marie",
    subtitle: "Paradis Tropicaux et Eaux Cristallines",
    description: "Évadez-vous sur des plages de sable blanc bordées de cocotiers. Du parfum d''ylang-ylang de Nosy Be aux eaux calmes de Sainte Marie où dansent les baleines à bosse, vivez une expérience balnéaire inoubliable.",
    buttonText: "Découvrir nos séjours",
    link: "#destinations"
  }
];

const HomeHero = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    apiService.getSlides()
      .then((data) => {
        if (data && data.length > 0) {
          setSlides(data);
          setCurrentIndex(1); // reset index when slides change
        }
      })
      .catch((err) => console.error('Error fetching slides:', err));
  }, []);

  // Extend the slides array to enable infinite scrolling
  const extendedSlides = [
    slides[slides.length - 1], // Clone of the last slide
    ...slides,                 // Original slides
    slides[0]                  // Clone of the first slide
  ];

  // Auto-play interval (resets when index changes)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning]);

  // Which slide index is currently active (0 to slides.length - 1)
  let activeIndex = currentIndex - 1;
  if (currentIndex === 0) {
    activeIndex = slides.length - 1;
  } else if (currentIndex === extendedSlides.length - 1) {
    activeIndex = 0;
  }

  // Text slide-up animation trigger on active slide change
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDotClick = (index) => {
    if (!isTransitioning) return;
    setCurrentIndex(index + 1);
  };

  const handleTransitionEnd = () => {
    // Jump to the actual slide when hitting a clone boundary
    if (currentIndex === extendedSlides.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
    }
  };

  // Re-enable transitions after jumping back to normal index range
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  // Guard: don't render if activeIndex is out of bounds
  if (!slides[activeIndex]) return null;

  return (
    <section className="hero" style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      
      {/* Background Images Sliding Container */}
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${extendedSlides.length * 100}%`,
          height: '100%',
          display: 'flex',
          transform: `translateX(-${(currentIndex * 100) / extendedSlides.length}%)`,
          transition: isTransitioning ? 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          zIndex: 1,
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={index}
            style={{
              width: `${100 / extendedSlides.length}%`,
              height: '100%',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <img
              src={getImageUrl(slide.image_url || slide.image, '/image/home_hero.png')}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(1.1) contrast(1.1) saturate(1.05)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Static overlay gradient on top of sliding background */}
      <div 
        className="hero-overlay" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} 
      />

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 5, width: '100%' }}>
        <div 
          className="hero-content"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(25px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '650px'
          }}
        >
          <h1 style={{ color: '#1B5E20', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px', fontSize: 'clamp(40px, 8vw, 72px)', margin: '0 0 8px 0', fontWeight: 800 }}>
            {slides[activeIndex].title}
          </h1>
          <h2 style={{ color: '#000000', fontWeight: 700, marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3, fontSize: 'clamp(20px, 4vw, 32px)' }}>
            {slides[activeIndex].subtitle}
          </h2>
          <p style={{ 
            color: '#222', 
            lineHeight: 1.6, 
            fontWeight: 500, 
            marginBottom: '32px', 
            background: 'rgba(255, 255, 255, 0.72)', 
            padding: '24px', 
            borderRadius: '16px', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            textAlign: 'justify',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
            fontSize: 'clamp(14px, 2vw, 16px)'
          }}>
            {slides[activeIndex].description}
          </p>
          <a href={slides[activeIndex].link} style={{
            display: 'inline-flex',
            backgroundColor: '#1B5E20',
            color: '#fff',
            padding: '16px 36px',
            borderRadius: '100px',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 18px rgba(27, 94, 32, 0.35)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#154A19';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(27, 94, 32, 0.45)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#1B5E20';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(27, 94, 32, 0.35)';
          }}
          >
            {slides[activeIndex].button_text || slides[activeIndex].buttonText}
            <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Navigation Controls (Arrows) */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#000',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.55)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#000',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.55)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators (Dots) */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10,
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            style={{
              width: index === activeIndex ? '28px' : '10px',
              height: '10px',
              borderRadius: '999px',
              backgroundColor: index === activeIndex ? '#1B5E20' : 'rgba(0, 0, 0, 0.35)',
              border: index === activeIndex ? 'none' : '1px solid rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ))}
      </div>

    </section>
  );
};

export default HomeHero;
