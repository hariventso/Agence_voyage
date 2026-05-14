import React from 'react';

const HomeServiceOffer = ({ loading, destinations }) => {
  return (
    <section id="services" className="travel-style">
      <div className="container">
        <h2 style={{ color: '#1B5E20', marginBottom: '40px' }}>Nos offres de services</h2>
        {loading ? (
          <p>Chargement des offres...</p>
        ) : (
          <div className="travel-grid">
            {destinations.length > 0 ? destinations.map(dest => (
              <div 
                key={dest.id} 
                className="travel-card" 
                style={{ cursor: 'pointer' }} 
                onClick={() => window.location.hash = `#view-${dest.id}`}
              >
                <img 
                  src={dest.image_url || '/image/hero_new.png'} 
                  alt={dest.name} 
                  className="travel-image" 
                  loading="lazy" 
                  style={{ height: '300px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ color: '#1B5E20', margin: '0 0 8px 0' }}>{dest.name}</h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666', 
                    lineHeight: '1.4', 
                    marginBottom: '10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {dest.description || 'Découvrez Madagascar au-delà des sentiers battus...'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {dest.type}
                  </p>
                </div>
              </div>
            )) : (
              <p>Aucune offre disponible. Ajoutez-en dans le dashboard !</p>
            )}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="#destinations" style={{ color: '#1B5E20', fontWeight: 700, textDecoration: 'none' }}>Voir toutes les destinations →</a>
        </div>
      </div>
    </section>
  );
};

export default HomeServiceOffer;
