import React from 'react';
import { MapPin } from 'lucide-react';

const DestinationGrid = ({ loading, destinations }) => {
  return (
    <section style={{ backgroundColor: '#000', padding: '80px 20px', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h2 style={{ color: '#FF8C00', marginBottom: '40px' }}>Nos Offres</h2>
        {loading ? (
          <p>Chargement des merveilles de Madagascar...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', textAlign: 'left' }}>
            {destinations.map(dest => (
              <div 
                key={dest.id} 
                onClick={() => window.location.hash = `#view-${dest.id}`}
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={dest.image_url || '/image/mountain.png'} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FF8C00', color: '#fff', padding: '10px 20px', fontWeight: 600 }}>
                    {dest.service_name}
                  </div>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#000' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                      <MapPin size={18} color="#FF8C00" /> {dest.name}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#000' }}>{dest.price}</div>
                  </div>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '14px', 
                    lineHeight: 1.5, 
                    marginBottom: '20px', 
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {dest.description || 'Plongez dans l\'aventure et découvrez des paysages époustouflants...'}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.hash = `#detail-${dest.id}`;
                    }}
                    style={{ 
                      backgroundColor: '#1B5E20', 
                      color: '#fff', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: 'none',
                      textAlign: 'center', 
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#2E7D32'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#1B5E20'}
                  >
                    Voir le circuit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationGrid;
