import React from 'react';

const HomeTrusted = ({ isMobile }) => {
  return (
    <section style={{ 
      padding: isMobile ? '40px 16px' : '80px 20px', 
      backgroundColor: '#fff' 
    }}>
      <div className="container" style={{ 
        maxWidth: '1200px',
        position: 'relative',
        height: isMobile ? 'auto' : '450px',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '60px 30px' : '0 80px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <img 
          src="/image/luxury_resort_pool_banner.png" 
          alt="Luxury Resort" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            zIndex: 0
          }} 
        />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1
        }}></div>

        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          maxWidth: '600px',
          color: '#fff'
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '28px' : '42px', 
            fontWeight: 700, 
            marginBottom: '20px',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            lineHeight: 1.2
          }}>
            Nos engagements
          </h2>
          <div style={{ 
            fontSize: isMobile ? '15px' : '17px', 
            lineHeight: 1.6,
            opacity: 0.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '16px' }}>Nous croyons en un tourisme respectueux et porteur de sens. C’est pourquoi nous nous engageons à :</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>• Valoriser la richesse culturelle et historique de Madagascar auprès d’un public local et international</li>
              <li>• Respecter l’identité et la dignité des populations locales</li>
              <li>• Contribuer au développement des communautés visitées à travers des actions solidaires</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTrusted;
