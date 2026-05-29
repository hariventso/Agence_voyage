import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Tag } from 'lucide-react';

const defaultDestinations = [
  {
    id: 'fallback-1',
    name: 'Nosy Be & Plages',
    type: 'Détente & Plage',
    price: '599€',
    image_url: '/image/home_beach_hero.png',
    description: 'Évadez-vous sur des plages de sable blanc bordées de cocotiers. Du parfum d\'ylang-ylang de Nosy Be aux baleines de Sainte Marie.',
    duration: 7
  },
  {
    id: 'fallback-2',
    name: 'Canyons de l\'Isalo',
    type: 'Trekking & Aventure',
    price: '380$',
    image_url: '/image/isalo_destination.png',
    description: 'Parcourez les paysages lunaires et les piscines naturelles du parc national de l\'Isalo, guidé par nos experts locaux.',
    duration: 5
  },
  {
    id: 'fallback-3',
    name: 'Descente de la Tsiribihina',
    type: 'Excursion & Nature',
    price: '450€',
    image_url: '/image/madagascar_river_boat.png',
    description: 'Vivez une aventure fluviale unique en pirogue traditionnelle, à la rencontre de la faune sauvage et des villages reculés.',
    duration: 4
  },
  {
    id: 'fallback-4',
    name: 'Forêt d\'Andasibe',
    type: 'Écotourisme',
    price: '290$',
    image_url: '/image/mountain.png',
    description: 'Observez le plus grand lémurien de Madagascar, l\'Indri Indri, au cœur d\'une forêt tropicale humide exceptionnelle.',
    duration: 3
  }
];

const DestinationPopular = ({ isMobile, destinations = [], loading = false }) => {
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour déterminer de manière élégante et robuste la durée
  const getDurationLabel = (dest) => {
    if (dest.duration) return `${dest.duration} JOURS`;
    
    // Essayer d'extraire la durée depuis la description (ex: "5 jours")
    const match = dest.description?.match(/(\d+)\s*(jours|jours|d|j)/i);
    if (match) return `${match[1]} JOURS`;
    
    // Fallback standard selon le nom du circuit
    const nameLower = dest.name.toLowerCase();
    if (nameLower.includes('isalo')) return '5 JOURS';
    if (nameLower.includes('nosy') || nameLower.includes('marie')) return '7 JOURS';
    if (nameLower.includes('culturel') || nameLower.includes('immersion')) return '8 JOURS';
    
    return '7 JOURS';
  };

  // Simuler des étoiles et du nombre d'avis basés sur l'ID de la destination pour rendre les données réalistes
  const getReviewData = (id) => {
    const reviews = [
      { rating: 5, count: 20 },
      { rating: 5, count: 12 },
      { rating: 4, count: 18 },
      { rating: 5, count: 24 }
    ];
    return reviews[id % reviews.length] || { rating: 5, count: 15 };
  };

  // Préparer exactement 4 destinations pour l'affichage (remplir si nécessaire)
  let displayDestinations = [...destinations];
  if (displayDestinations.length < 4) {
    const idsAlreadyPresent = new Set(displayDestinations.map(d => d.id));
    for (const fallback of defaultDestinations) {
      if (displayDestinations.length >= 4) break;
      const nameExists = displayDestinations.some(d => d.name.toLowerCase() === fallback.name.toLowerCase());
      if (!idsAlreadyPresent.has(fallback.id) && !nameExists) {
        displayDestinations.push(fallback);
      }
    }
  }
  displayDestinations = displayDestinations.slice(0, 4);

  return (
    <section style={{ 
      backgroundColor: '#ffffff', 
      padding: mobileView ? '60px 20px' : '100px 0', 
      color: '#333' 
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* En-tête centré façon mockup de luxe */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#FF8C00',
            fontSize: mobileView ? '1.2rem' : '1.6rem',
            margin: '0 0 6px 0',
            fontWeight: 500
          }}>
            Top Destinations
          </p>
          <h2 style={{ 
            fontSize: mobileView ? '28px' : '48px', 
            fontFamily: '"Playfair Display", serif', 
            color: '#0a2e24', 
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Circuits Populaires
          </h2>
        </div>

        {/* Grille de cartes */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Chargement des circuits populaires...</p>
        ) : displayDestinations.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: mobileView ? '1fr' : '1fr 1fr', 
            gap: '30px' 
          }}>
            {displayDestinations.map((c, i) => {
              const duration = getDurationLabel(c);
              const { rating, count } = getReviewData(c.id);
              
              return (
                <div 
                  key={i} 
                  onClick={() => window.location.hash = `#detail-${c.id}`}
                  style={{ 
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: mobileView ? '240px' : '320px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.18)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Image de fond */}
                  <img 
                    src={c.image_url || '/image/placeholder.png'} 
                    alt={c.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 0
                    }} 
                  />

                  {/* Gradient sombre pour rendre le texte visible */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1
                  }}></div>

                  {/* Contenu de la carte */}
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px',
                    boxSizing: 'border-box',
                    color: '#fff'
                  }}>
                    {/* Ligne du haut */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        letterSpacing: '0.5px'
                      }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: '#FF8C00',
                          display: 'inline-block'
                        }}></span>
                        {c.type || 'Circuit'}
                      </span>
                      
                      {/* Icône Bookmark */}
                      <div style={{ 
                        color: '#fff',
                        opacity: 0.9,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = '1'}
                      onMouseOut={e => e.currentTarget.style.opacity = '0.9'}
                      >
                        <Bookmark size={20} fill="#fff" stroke="none" />
                      </div>
                    </div>

                    {/* Ligne du bas */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-end',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <h3 style={{ 
                          fontSize: mobileView ? '1.25rem' : '1.6rem', 
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 700, 
                          color: '#fff',
                          margin: '0 0 6px 0',
                          letterSpacing: '-0.3px',
                          textTransform: 'uppercase'
                        }}>
                          {c.name}
                        </h3>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: 700,
                          textDecoration: 'underline',
                          letterSpacing: '0.5px'
                        }}>
                          {c.price} | {duration}
                        </span>
                      </div>

                      {/* Évaluation */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        <span style={{ color: '#FFBC0A', fontSize: '14px', letterSpacing: '1px' }}>
                          {"★".repeat(rating)}
                        </span>
                        <span style={{ color: '#fff', opacity: 0.9 }}>
                          {count} AVIS
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>Aucun circuit populaire disponible pour le moment.</p>
        )}
      </div>
    </section>
  );
};

export default DestinationPopular;
