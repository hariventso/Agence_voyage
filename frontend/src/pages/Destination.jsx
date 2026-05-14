import React, { useState, useEffect } from 'react';
import DestinationHero from '../components/destinations/DestinationHero';
import DestinationGrid from '../components/destinations/DestinationGrid';
import DestinationPopular from '../components/destinations/DestinationPopular';
import { apiService } from '../services/api';

function Destination() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchDestinations();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await apiService.getDestinations();
      setDestinations(data.filter(d => d.status === 'Actif'));
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <DestinationHero isMobile={isMobile} />
      <DestinationGrid loading={loading} destinations={destinations} />
      
      <DestinationPopular isMobile={isMobile} destinations={destinations.slice(0, 3)} />

      <section style={{ backgroundColor: '#000', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #111', color: '#666' }}>
        <p>© 2026 Explor'île Madagascar - Tous droits réservés</p>
      </section>
    </div>
  );
}

export default Destination;
