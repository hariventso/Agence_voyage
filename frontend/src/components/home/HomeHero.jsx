import React from 'react';
import { ArrowRight } from 'lucide-react';

const HomeHero = () => {
  return (
    <section className="hero" style={{ alignItems: 'center', display: 'flex' }}>
      <img 
        src="/image/beach_sunset_hero.png" 
        alt="Hero" 
        className="hero-bg" 
        style={{ 
          objectPosition: 'center',
          filter: 'brightness(1.15) contrast(1.15) saturate(1.1)',
          imageRendering: 'auto'
        }} 
      />
      <div className="hero-overlay" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 100%)' }}></div>
      <div className="container">
        <div className="hero-content">
          <h1 style={{ color: '#1B5E20', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}>
            Explor'île
          </h1>
          <h2 style={{ color: '#000000', fontWeight: 600, marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4 }}>
            Sur les traces des Malgaches
          </h2>
          <p style={{ color: '#222', lineHeight: 1.6, fontWeight: 500, marginBottom: '32px', background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '12px', textAlign: 'justify' }}>
            Envie de découvrir Madagascar au-delà des sentiers battus ? Explor’île vous invite à vivre des expériences uniques, au croisement du tourisme culturel et de l’aventure. Nos voyages sont conçus à partir de recherches scientifiques, de savoirs locaux et de récits authentiques, pour vous offrir bien plus qu’un simple séjour : une véritable immersion au cœur de l’âme malgache.
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
  );
};

export default HomeHero;
