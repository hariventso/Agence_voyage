import React from 'react';

const PopularTours = ({ isMobile }) => {
  const tours = [
    { name: 'Thailand', price: '$599', tags: 'Beach | Hotel | Vehicle' },
    { name: 'North Africa', price: '$800', tags: 'Beach | Hotel | Vehicle' },
    { name: 'South Korea', price: '$650', tags: 'Beach | Hotel | Vehicle' },
    { name: 'Swizzerland', price: '$700', tags: 'Beach | Hotel | Vehicle' }
  ];

  return (
    <section style={{
      backgroundColor: '#000',
      padding: isMobile ? '60px 0' : '100px 0'
    }}>
      <div className="container">
        <h2 style={{
          fontSize: isMobile ? '2.2rem' : '3rem',
          fontFamily: "'Playfair Display', serif",
          color: '#FF8C00',
          marginBottom: '16px',
          fontWeight: 600
        }}>
          Nos Circuits Populaires
        </h2>
        <p style={{
          color: '#ccc',
          fontSize: '0.9rem',
          marginBottom: '48px',
          maxWidth: '800px'
        }}>
          Découvrez nos itinéraires les plus prisés, soigneusement conçus pour vous offrir un équilibre parfait entre aventure sauvage, confort hôtelier et immersion culturelle.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '40px' : '60px',
          alignItems: 'center'
        }}>
          {/* Left: Image with Video Button */}
          <div style={{
            flex: 1,
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            width: '100%',
            aspectRatio: '16/10'
          }}>
            <img
              src="/image/maldives.png"
              alt="Tour Video Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px', height: '64px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid #fff'
            }}>
              <div style={{
                width: 0, height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '15px solid #fff',
                marginLeft: '4px'
              }} />
            </div>
          </div>

          {/* Right: Tours List */}
          <div style={{ flex: 1, width: '100%' }}>
            {tours.map((tour, i) => (
              <div key={i} style={{
                borderBottom: '1px dashed #333',
                paddingBottom: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{tour.name}</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF8C00' }}>{tour.price}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#FF8C00', fontWeight: 600, marginBottom: '4px' }}>{tour.tags}</div>
                <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                  Un voyage immersif combinant détente sur les plages paradisiaques et découverte des traditions locales.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;
