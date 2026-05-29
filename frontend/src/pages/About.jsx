import React, { useState, useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutTeam from '../components/about/AboutTeam';
import TeamExpertGrid from '../components/about/TeamExpertGrid';
import StatsCounter from '../components/about/StatsCounter';
import DestinationPopular from '../components/destinations/DestinationPopular';
import TestimonialSlider from '../components/about/TestimonialSlider';
import { apiService } from '../services/api';

const staticTeamMembers = [
  { name: 'Miora Rakoto', role: 'Guide culturelle & Co-fondatrice', bio: 'Passionnée par le patrimoine malgache...', image: '/image/expert1.png' },
  { name: 'Hery Andriantsoa', role: 'Expert circuits & Logistique', bio: 'Hery conçoit chaque itinéraire avec précision...', image: '/image/hero_new.png' },
  { name: 'Lalaina Rasoamanana', role: 'Spécialiste séjours balnéaires', bio: 'Des côtes de Nosy Be à Sainte-Marie...', image: '/image/maldives.png' },
  { name: 'Tantely Razafindrakoto', role: 'Conseiller aventure & nature', bio: 'Tantely est votre référent pour les expéditions...', image: '/image/mountain.png' }
];

const travelReviews = [
  { name: 'Jean-Pierre Morel', role: 'Client Fidèle', rating: 5, image: '/image/expert1.png', quote: "Un voyage exceptionnel..." },
  { name: 'Sarah Jenkins', role: 'Voyageuse Solo', rating: 5, image: '/image/expert3.png', quote: "L'organisation était parfaite..." },
  { name: 'Marc Lefebvre', role: 'Aventure en Famille', rating: 4, image: '/image/expert2.png', quote: "Une immersion totale..." }
];

function About() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [teamMembers, setTeamMembers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchData = async () => {
      try {
        const [t, te, d] = await Promise.all([
          apiService.getTeam(),
          apiService.getTestimonials(),
          apiService.getDestinations()
        ]);
        setTeamMembers(t.length > 0 ? t : staticTeamMembers);
        setTestimonials(te.length > 0 ? te : travelReviews);
        setDestinations(d.filter(dest => dest.status === 'Actif').slice(0, 3));
      } catch (err) {
        console.error("Error fetching about data:", err);
        setTeamMembers(staticTeamMembers);
        setTestimonials(travelReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <AboutHero isMobile={isMobile} />
      <AboutTeam isMobile={isMobile} />
      <TeamExpertGrid teamMembers={teamMembers} isMobile={isMobile} />
      <StatsCounter isMobile={isMobile} />
      <DestinationPopular isMobile={isMobile} destinations={destinations} loading={loading} />
      <TestimonialSlider 
        testimonials={testimonials} 
        isMobile={isMobile} 
      />
    </div>
  );
}

export default About;
