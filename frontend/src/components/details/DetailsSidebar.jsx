import React from 'react';

const DetailsSidebar = ({ isMobile, destination }) => {
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
      
      {/* Banner 1: Destination Info Card */}
      <div 
        style={{
          height: '180px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url("${banner1Img}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
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
        onClick={() => document.getElementById('formulaire-devis')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          color: '#fff'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {banner1Title}
          </h3>
          <p style={{ fontSize: '12px', fontWeight: 600, margin: 0, opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
            &lt; {banner1Text}
          </p>
        </div>
      </div>

      {/* Banner 2: Activities Promo */}
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

      {/* Banner 3: Train / Booking Promo */}
      <div 
        style={{
          minHeight: '220px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url("${banner3Img}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
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
          position: 'absolute',
          top: '20px',
          right: '0',
          backgroundColor: '#C21A4B',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 800,
          padding: '6px 14px 6px 16px',
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          AU MEILLEUR PRIX
        </div>

        <div>
          <h3 style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: 800,
            margin: '0 0 16px 0',
            lineHeight: 1.3
          }}>
            {banner3Title} <br/>
            EN TRAIN
          </h3>
          
          <div style={{
            backgroundColor: '#fff',
            color: '#C21A4B',
            padding: '10px 20px',
            borderRadius: '24px',
            fontSize: '11px',
            fontWeight: 800,
            textAlign: 'center',
            display: 'inline-block',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}>
            C'EST PAR ICI
          </div>
        </div>
      </div>

    </aside>
  );
};

export default DetailsSidebar;
