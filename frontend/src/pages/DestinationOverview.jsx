import React, { useState, useEffect } from 'react';
import DestinationGrid from '../components/destinations/DestinationGrid';
import { apiService } from '../services/api';

const DestinationOverview = ({ destinationId }) => {
  const [destination, setDestination] = useState(null);
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [destData, allData] = await Promise.all([
          apiService.getDestination(destinationId),
          apiService.getDestinations()
        ]);

        if (destData) {
          setDestination(destData);
        }

        if (Array.isArray(allData)) {
          setAllDestinations(allData.filter(d => d.status === 'Actif'));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [destinationId]);

  if (loading) return null;
  if (!destination) return <div style={{ padding: '100px', textAlign: 'center' }}>Destination non trouvée</div>;

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      {/* Hero Image Section */}
      <section style={{ 
        position: 'relative', 
        height: isMobile ? '60vh' : '75vh', 
        minHeight: isMobile ? '400px' : '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={destination.image_url || '/image/mountain.png'} 
          alt={destination.name} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: isMobile ? '3rem' : '5rem', 
            fontWeight: 800, 
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            {destination.name}
          </h1>
        </div>
      </section>

      {/* Description Section */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 20px', backgroundColor: '#000' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ 
            color: '#FF8C00', 
            marginBottom: '40px', 
            fontSize: isMobile ? '28px' : '40px',
            fontFamily: '"Playfair Display", serif',
            textAlign: 'center'
          }}>
            À propos de {destination.name}
          </h2>
          <p style={{ 
            fontSize: isMobile ? '16px' : '18px', 
            lineHeight: 1.8, 
            textAlign: 'justify',
            color: '#ccc',
            margin: '0 auto',
            maxWidth: '100%'
          }}>
            {destination.description || "Madagascar est une destination d'exception qui promet des aventures inoubliables. Ce circuit vous invite à découvrir une biodiversité unique au monde, des paysages époustouflants et une culture d'une richesse incroyable. Entre parcs nationaux préservés, plages de rêve et rencontres authentiques avec les populations locales, chaque étape de votre voyage est une invitation à l'évasion et à l'émerveillement."}
          </p>
        </div>
      </section>

      {/* List of Other Destinations */}
      <div style={{ backgroundColor: '#000', padding: '60px 0 20px 0' }}>
        <h2 style={{ color: '#FF8C00', textAlign: 'center', fontSize: '2.5rem', fontFamily: '"Playfair Display", serif' }}>
          Découvrez nos autres destinations
        </h2>
      </div>
      <DestinationGrid loading={false} destinations={allDestinations} />
    </div>
  );
};

export default DestinationOverview;
