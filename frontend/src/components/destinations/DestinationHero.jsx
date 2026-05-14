import React from 'react';

const DestinationHero = ({ isMobile }) => {
  return (
    <section style={{
      position: 'relative',
      height: isMobile ? '60vh' : '75vh',
      minHeight: isMobile ? '400px' : '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      paddingTop: isMobile ? '80px' : '100px'
    }}>
      <img src="/image/isalo_destination.png" alt="Parc National de l'Isalo" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
        <h1 style={{ color: '#FF8C00', fontWeight: 700, marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: isMobile ? '3rem' : '5rem' }}>
          Destination
        </h1>
        <p style={{ color: '#FFFFFF', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto', fontWeight: 400 }}>
          Explorez les merveilles de Madagascar à travers nos circuits authentiques.
        </p>
      </div>
    </section>
  );
};

export default DestinationHero;
