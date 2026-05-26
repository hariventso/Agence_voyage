import React from 'react';

const HomeServiceOffer = ({ loading, services, destinations }) => {
  return (
    <section id="services" className="travel-style">
      <div className="container">
        <h2 style={{ color: '#1B5E20', marginBottom: '40px' }}>Nos offres de services</h2>
        {loading ? (
          <p>Chargement des offres...</p>
        ) : (
          <div className="travel-grid">
            {services.length > 0 ? services.map(service => {
              const matchCount = destinations.filter(dest => dest.service_name === service.name).length;
              return (
                <div 
                  key={service.id} 
                  className="travel-card" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => window.location.hash = `#destinations?service=${encodeURIComponent(service.name)}`}
                >
                  <img 
                    src={service.image_url || '/image/hero_new.png'} 
                    alt={service.name} 
                    className="travel-image" 
                    loading="lazy" 
                    style={{ height: '300px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: '#1B5E20', margin: '0 0 8px 0' }}>{service.name}</h3>
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
                      {service.description || 'Sélectionnez ce service pour découvrir les circuits associés.'}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {matchCount} circuit{matchCount > 1 ? 's' : ''} associé{matchCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <p>Aucune offre disponible. Ajoutez-en dans le dashboard !</p>
            )}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="#destinations" style={{ color: '#1B5E20', fontWeight: 700, textDecoration: 'none' }}>Voir toutes les circuits →</a>
        </div>
      </div>
    </section>
  );
};

export default HomeServiceOffer;
