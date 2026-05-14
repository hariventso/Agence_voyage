import React from 'react';

const DestinationPopular = ({ isMobile, destinations = [] }) => {

  return (
    <section style={{ backgroundColor: '#000', padding: isMobile ? '60px 20px' : '100px 0', color: '#fff' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: isMobile ? '28px' : '48px', 
            fontFamily: '"Plus Jakarta Sans", sans-serif', 
            color: '#FF8C00', 
            marginBottom: '16px' 
          }}>
            Nos Circuits Populaires
          </h2>
          <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '700px', lineHeight: 1.6, textAlign: 'justify' }}>
            Découvrez nos itinéraires les plus prisés, soigneusement conçus pour vous offrir un équilibre parfait entre aventure sauvage, confort hôtelier et immersion culturelle.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', 
          gap: isMobile ? '40px' : '80px',
          alignItems: 'center'
        }}>
          {/* Video/Image Left */}
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: isMobile ? '300px' : '500px' }}>
            <img 
              src="/image/isalo_destination.png" 
              alt="Popular Destination" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />

          </div>

          {/* List Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {destinations.length > 0 ? destinations.map((c, i) => (
              <div key={i} style={{ borderBottom: i !== destinations.length - 1 ? '1px solid #333' : 'none', paddingBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>{c.name}</h3>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#FF8C00' }}>{c.price}</span>
                </div>
                <p style={{ color: '#FF8C00', fontSize: '14px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                  {c.type}
                </p>
                <p style={{ color: '#999', fontSize: '15px', lineHeight: 1.6, textAlign: 'justify', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.description}
                </p>
              </div>
            )) : (
              <p>Chargement des circuits populaires...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationPopular;
