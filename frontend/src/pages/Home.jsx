import React, { useState, useEffect } from 'react';
import HomeHero from '../components/home/HomeHero';
import HomeAbout from '../components/home/HomeAbout';
import HomeFeatures from '../components/home/HomeFeatures';
import HomeServiceOffer from '../components/home/HomeServiceOffer';
import HomeTrusted from '../components/home/HomeTrusted';
import DestinationPopular from '../components/destinations/DestinationPopular';
import { apiService } from '../services/api';

function Home() {
  const [services, setServices] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const fetchHomeData = async () => {
      try {
        const [serviceData, destinationData] = await Promise.all([
          apiService.getServices(),
          apiService.getDestinations()
        ]);
        const activeServices = serviceData.filter(s => s.status === 'Actif');
        const activeDestinations = destinationData.filter(d => d.status === 'Actif');
        setServices(activeServices);
        setDestinations(activeDestinations);
        setPopularDestinations(activeDestinations.filter(d => d.is_popular).slice(0, 4));
      } catch (err) {
        console.error('Erreur fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeFeatures />
      <HomeTrusted isMobile={isMobile} />
      <HomeServiceOffer loading={loading} services={services} destinations={destinations} />
      <DestinationPopular isMobile={isMobile} destinations={popularDestinations} />
      
    </>
  );
}

export default Home;
