import React, { useState, useEffect } from 'react';
import HomeHero from '../components/home/HomeHero';
import HomeAbout from '../components/home/HomeAbout';
import HomeFeatures from '../components/home/HomeFeatures';
import HomeServiceOffer from '../components/home/HomeServiceOffer';
import HomeTrusted from '../components/home/HomeTrusted';
import { apiService } from '../services/api';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const fetchDestinations = async () => {
      try {
        const data = await apiService.getDestinations();
        setDestinations(data.filter(d => d.status === 'Actif').slice(0, 4));
      } catch (err) {
        console.error('Erreur fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeFeatures />
      <HomeTrusted isMobile={isMobile} />
      <HomeServiceOffer loading={loading} destinations={destinations} />
    </>
  );
}

export default Home;
