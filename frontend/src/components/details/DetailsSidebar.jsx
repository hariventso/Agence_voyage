import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DetailsSidebar = ({ isMobile, destination }) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const nameLower = (destination.name || '').toLowerCase();
  
  // Decide which theme to use (Madagascar vs Italy/Mockup)
  const isMadagascar = nameLower.includes('sud') || nameLower.includes('nosy') || nameLower.includes('marie') || nameLower.includes('sainte') || nameLower.includes('tana') || nameLower.includes('antananarivo');

  const banner1Img = isMadagascar ? '/image/madagascar_river_boat.png' : '/image/image1.jpeg';
  const banner1Title = isMadagascar ? 'Madagascar' : 'Italie';
  const banner1Text = isMadagascar 
    ? 'En savoir plus sur cette destination d\'exception' 
    : 'En savoir plus sur cette destination en train';

  const banner2Bg = '/image/beach_sunset_hero.png';
  const banner3Img = isMadagascar ? '/image/isalo_destination.png' : '/image/image3.jpeg';
  const banner3Title = isMadagascar ? 'MADAGASCAR' : "L'ITALIE";

  let galleryImages = [];
  try {
    if (destination.gallery) {
      galleryImages = JSON.parse(destination.gallery);
      if (!Array.isArray(galleryImages)) galleryImages = [];
    }
  } catch (e) {
    console.error("Failed to parse gallery images", e);
  }

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImgIdx(prev => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  return (
    <aside className="sidebar" style={{ 
      padding: '20px 0', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      position: 'sticky',
      top: '100px',
      alignSelf: 'start',
      width: '100%',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      fontFamily: '"Outfit", sans-serif'
    }}>


      {/* Banner 2: Dynamic Photo Gallery Slider OR Fallback Activities Promo */}
      {galleryImages.length > 0 ? (
        <div 
          style={{
            height: '420px',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
          }}
        >
          {/* Slides Container */}
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {galleryImages.map((imgUrl, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: index === activeImgIdx ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: index === activeImgIdx ? 1 : 0
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Gallery image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dark Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }} />

          {/* Controls / Info */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            zIndex: 3,
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Galerie
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '8px 0 0', textShadow: '0 2px 4px rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>
                {destination.name} en images
              </h4>
            </div>
            
            {/* Simple Indicators */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImgIdx(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === activeImgIdx ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div 
          style={{
            minHeight: '280px',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: `linear-gradient(to bottom, rgba(10,46,36,0.5), rgba(10,46,36,0.95)), url("${banner2Bg}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px 24px',
            transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
          }}
          onClick={() => document.getElementById('formulaire-devis')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div style={{
            backgroundColor: '#C21A4B',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '4px 10px',
            borderRadius: '4px',
            alignSelf: 'flex-start'
          }}>
            Sur place
          </div>

          <div style={{ margin: '20px 0' }}>
            <h2 style={{
              color: '#fff',
              fontSize: '26px',
              lineHeight: 1.2,
              fontWeight: 800,
              margin: 0,
              fontFamily: '"Outfit", sans-serif'
            }}>
              TES ACTIVITÉS <br/>
              <span style={{ color: '#FFD700' }}>SUR PLACE</span> <br/>
              AU MEILLEUR PRIX
            </h2>
          </div>

          <div style={{
            backgroundColor: '#C21A4B',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '24px',
            fontSize: '13px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(194,26,75,0.3)',
            transition: 'background-color 0.2s',
            alignSelf: 'center',
            width: '80%'
          }}
          onMouseEnter={(e) => e.stopPropagation()}
          >
            JE DÉCOUVRE !
          </div>
        </div>
      )}


    </aside>
  );
};

export default DetailsSidebar;
