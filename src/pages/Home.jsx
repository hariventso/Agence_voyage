import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Camera, User, ShieldCheck } from 'lucide-react';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/destinations');
        const data = await res.json();
        setDestinations(data.filter(d => d.status === 'Actif').slice(0, 4));
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ alignItems: 'center', display: 'flex' }}>
        <img src="/image/hero_new.png" alt="Hero" className="hero-bg" style={{ objectPosition: 'center 20%' }} />
        <div className="hero-overlay" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 100%)' }}></div>
        <div className="container">
          <div className="hero-content">
            <h1 style={{ color: '#1B5E20', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}>
              Explor'île
            </h1>
            <h2 style={{ color: '#000000', fontWeight: 600, marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4 }}>
              Sur les traces des Malgaches
            </h2>
            <p style={{ color: '#222', lineHeight: 1.6, fontWeight: 500, marginBottom: '32px', background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '12px', textAlign: 'justify' }}>
              Envie de découvrir Madagascar au-delà des sentiers battus ? Explor'île vous invite à vivre des expériences uniques, au croisement du tourisme culturel et de l'aventure.
            </p>
            <a href="#destinations" style={{
              display: 'inline-flex',
              backgroundColor: '#1B5E20',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: '100px',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(27, 94, 32, 0.3)'
            }}>
              Découvrir nos offres
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 style={{ color: '#1B5E20' }}>Une véritable immersion au cœur de l’âme malgache</h2>
              <p style={{ textAlign: 'justify' }}>Nos voyages sont conçus à partir de recherches scientifiques, de savoirs locaux et de récits authentiques, pour vous offrir bien plus qu’un simple séjour : une véritable immersion au cœur de l’âme malgache.</p>
              <p style={{ textAlign: 'justify' }}>Alors, partez à la rencontre d’un patrimoine vivant exceptionnel : traditions, danses et chants, modes de vie ruraux, riziculture, pêche artisanale, sans oublier les croyances et les sites sacrés qui façonnent l’identité de l’île.</p>
            </div>
            <div className="about-image">
              <img src="/image/mountain.png" alt="Paysage Malgache" loading="lazy" style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Nos offres de services Section */}
      <section id="services" className="travel-style">
        <div className="container">
          <h2 style={{ color: '#1B5E20', marginBottom: '40px' }}>Nos offres de services</h2>
          {loading ? (
            <p>Chargement des offres...</p>
          ) : (
            <div className="travel-grid">
              {destinations.length > 0 ? destinations.map(dest => (
                <div key={dest.id} className="travel-card" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = '#destinations'}>
                  <img src={dest.image_url || '/image/hero_new.png'} alt={dest.name} className="travel-image" loading="lazy" style={{ height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: '#1B5E20', margin: '0 0 8px 0' }}>{dest.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.4', marginBottom: '10px' }}>{dest.description || 'Découvrez Madagascar au-delà des sentiers battus...'}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>{dest.type} • <span style={{ fontWeight: 700, color: '#FF8C00' }}>{dest.price}</span></p>
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
    </>
  );
}

export default Home;
