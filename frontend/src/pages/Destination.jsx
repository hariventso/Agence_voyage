import React, { useState, useEffect } from 'react';
import DestinationHero from '../components/destinations/DestinationHero';
import DestinationGrid from '../components/destinations/DestinationGrid';
import DestinationPopular from '../components/destinations/DestinationPopular';
import { apiService } from '../services/api';

function Destination({ serviceFilter }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [destinations, setDestinations] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(serviceFilter || null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchPageData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSelectedService(null);
  }, [serviceFilter]);

  const fetchPageData = async () => {
    try {
      const [destinationData, serviceData] = await Promise.all([
        apiService.getDestinations(),
        apiService.getServices()
      ]);
      setDestinations(destinationData.filter(d => d.status === 'Actif'));
      setServices(serviceData.filter(s => s.status === 'Actif'));
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = selectedService
    ? destinations.filter(d => d.service_name === selectedService)
    : destinations;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <DestinationHero isMobile={isMobile} />

      <section style={{ padding: '60px 20px', backgroundColor: '#050505' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#FF8C00', marginBottom: '24px' }}>Filtrer par service</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setSelectedService(null)}
              style={{
                backgroundColor: !selectedService ? '#FF8C00' : '#111',
                color: !selectedService ? '#000' : '#fff',
                border: '1px solid #333',
                borderRadius: '999px',
                padding: '10px 18px',
                cursor: 'pointer'
              }}
            >
              Toutes les offres
            </button>
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.name)}
                style={{
                  backgroundColor: selectedService === service.name ? '#FF8C00' : '#111',
                  color: selectedService === service.name ? '#000' : '#fff',
                  border: '1px solid #333',
                  borderRadius: '999px',
                  padding: '10px 18px',
                  cursor: 'pointer'
                }}
              >
                {service.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <DestinationGrid loading={loading} destinations={filteredDestinations} />
      
      <DestinationPopular isMobile={isMobile} destinations={destinations.filter((d) => d.is_popular)} loading={loading} />

      <section style={{ backgroundColor: '#000', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #111', color: '#666' }}>
        <p>© 2026 Explor'île Madagascar - Tous droits réservés</p>
      </section>
    </div>
  );
}

export default Destination;
