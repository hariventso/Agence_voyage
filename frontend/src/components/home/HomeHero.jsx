import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../../services/api';

const fallbackSlides = [
  {
    image: '/image/beach_sunset_hero.png',
    title: "Sur les traces malgaches",
  },
  {
    image: '/image/isalo_destination.png',
    title: "Découvrez Madagascar avec nous — faites-en votre aventure",
  },
  {
    image: '/image/home_beach_hero.png',
    title: "18 ethnies à découvrir, un mode de vie dynamique et diversifié",
  }
];

const HomeHero = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    apiService.getSlides()
      .then((data) => {
        if (data && data.length > 0) {
          // Map title or subtitle appropriately if fetched dynamically
          const formatted = data.map(s => ({
            image: s.image_url || s.image,
            title: s.title || s.subtitle || s.description || "Madagascar"
          }));
          setSlides(formatted);
          setCurrentIndex(1);
        }
      })
      .catch((err) => console.error('Error fetching slides:', err));
  }, []);

  // Extend slides for infinite loop sliding
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0]
  ];

  // Auto-play interval
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, slides.length, isTransitioning]);

  let activeIndex = currentIndex - 1;
  if (currentIndex === 0) {
    activeIndex = slides.length - 1;
  } else if (currentIndex === extendedSlides.length - 1) {
    activeIndex = 0;
  }

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
    if (currentIndex === extendedSlides.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  if (!slides[activeIndex]) return null;

  return (
    <section className="hero" style={{
      position: 'relative',
      minHeight: isMobile ? 'auto' : '100vh',
      backgroundColor: '#FAF9F6',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '120px 20px 60px' : '100px 0 80px',
      overflow: 'hidden',
      fontFamily: '"Outfit", sans-serif'
    }}>
      {/* Decorative background shape */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '60%',
        height: '80%',
        background: 'radial-gradient(circle, rgba(27, 94, 32, 0.05) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 5, width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gap: isMobile ? '40px' : '64px',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Presentation Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            {/* Small Green Badge */}
            <div style={{
              backgroundColor: 'rgba(27, 94, 32, 0.08)',
              color: '#1B5E20',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '24px',
              display: 'inline-block'
            }}>
              Explor'île
            </div>

            {/* Main Heading */}
            <h1 style={{
              color: '#1B3D34',
              fontSize: isMobile ? '32px' : '48px',
              lineHeight: 1.15,
              fontWeight: 850,
              margin: '0 0 24px 0',
              letterSpacing: '-0.5px'
            }}>
              Agence de voyage et tour opérateur culturel et patrimonial
            </h1>

            {/* Paragraph Text */}
            <div style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#4A5568',
              marginBottom: '40px',
              fontWeight: 500,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#2D3748', fontSize: '17px' }}>
                Découvrez Madagascar autrement avec Explor’île.
              </p>
              <p style={{ margin: 0 }}>
                Nous vous invitons à vivre des expériences uniques au croisement du tourisme culturel et patrimonial.
              </p>
              <p style={{ margin: 0 }}>
                Nos voyages sont conçus à partir de recherches scientifiques, de savoirs locaux et de récits authentiques afin de vous offrir bien plus qu’un simple séjour : une véritable immersion au cœur de l’âme malgache.
              </p>
            </div>

            {/* CTA Button */}
            <a href="#destinations" style={{
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
              boxShadow: '0 8px 24px rgba(27, 94, 32, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#154A19';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(27, 94, 32, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1B5E20';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(27, 94, 32, 0.25)';
            }}
            >
              Découvrir nos offres
              <ArrowRight size={20} />
            </a>
          </div>

          {/* Right Column: Sliding Image Gallery */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '360px' : '530px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(10, 46, 36, 0.12)'
          }}>
            {/* Sliding Track */}
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: 'flex',
                width: `${extendedSlides.length * 100}%`,
                height: '100%',
                transform: `translateX(-${(currentIndex * 100) / extendedSlides.length}%)`,
                transition: isTransitioning ? 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              }}
            >
              {extendedSlides.map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${100 / extendedSlides.length}%`,
                    height: '100%',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  
                  {/* Text Overlay Card */}
                  <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    background: 'rgba(10, 46, 36, 0.72)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: isMobile ? '15px' : '18px',
                      fontWeight: 700,
                      lineHeight: 1.4,
                      textAlign: 'center',
                      fontFamily: '"Outfit", sans-serif'
                    }}>
                      {slide.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Navigation Arrow Left */}
            <button
              onClick={() => { handlePrev(); clearInterval(timerRef.current); }}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                color: '#1B3D34',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Slide Navigation Arrow Right */}
            <button
              onClick={() => { handleNext(); clearInterval(timerRef.current); }}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                color: '#1B3D34',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots Indicators */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              gap: '6px',
              zIndex: 10
            }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { handleDotClick(index); clearInterval(timerRef.current); }}
                  style={{
                    width: index === activeIndex ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: index === activeIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0
                  }}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHero;
