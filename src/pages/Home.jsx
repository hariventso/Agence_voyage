import React from 'react';
import { ArrowRight, Globe, Camera, User, ShieldCheck } from 'lucide-react';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ alignItems: 'center', display: 'flex' }}>
        <img src="/image/hero_new.png" alt="Happy couple on beach" className="hero-bg" style={{ objectPosition: 'center 20%' }} />
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
            <a href="#services" style={{ 
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
              <p style={{ textAlign: 'justify' }}>Chaque circuit est soigneusement élaboré et encadré par des professionnels passionnés, pour allier recherches scientifiques, découvertes, distractions et moments de détente.</p>
            </div>
            <div className="about-image">
              <img src="/image/mountain.png" alt="Paysage Malgache" style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Explor’île Section */}
      <section id="pourquoi" className="why-resort">
        <div className="container">
          <div className="why-header">
            <h2 style={{ color: '#1B5E20' }}>Pourquoi choisir Explor’île ?</h2>
            <p>Nous vous offrons une approche unique pour découvrir Madagascar autrement.</p>
          </div>

          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="why-card">
              <div className="why-icon"><Globe size={32} strokeWidth={1.5} color="#1B5E20" /></div>
              <h3>Une expérience authentique</h3>
              <p>Plongez dans la vie locale et découvrez Madagascar de l’intérieur.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><Camera size={32} strokeWidth={1.5} color="#1B5E20" /></div>
              <h3>Un contenu enrichissant</h3>
              <p>Des circuits inspirés de recherches en histoire, culture et patrimoine.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><User size={32} strokeWidth={1.5} color="#1B5E20" /></div>
              <h3>Des guides experts</h3>
              <p>Des guides-conférenciers pour donner du sens à chaque visite.</p>
            </div>

            <div className="why-card">
              <div className="why-icon"><ShieldCheck size={32} strokeWidth={1.5} color="#1B5E20" /></div>
              <h3>Un tourisme responsable</h3>
              <p>Des actions concrètes pour soutenir les communautés locales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos engagements Section */}
      <section className="trusted-section">
        <div className="container">
          <div className="trusted-card" style={{ background: '#04351e' }}>
            <img src="/image/hero_new.png" alt="Madagascar Paysage" className="trusted-bg" style={{ opacity: 0.3 }} />
            <div className="trusted-overlay" style={{ background: 'linear-gradient(90deg, rgba(4, 53, 30, 0.9) 0%, rgba(4, 53, 30, 0.7) 100%)' }}></div>
            <div className="trusted-content" style={{ maxWidth: '800px' }}>
              <h2>Nos engagements</h2>
              <p>Nous croyons en un tourisme respectueux et porteur de sens. C’est pourquoi nous nous engageons à :</p>
              <ul style={{ color: '#fff', fontSize: '18px', lineHeight: 1.6, textAlign: 'left', marginTop: '24px', listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Valoriser la richesse culturelle et historique de Madagascar auprès d’un public local et international</li>
                <li>Respecter l’identité et la dignité des populations locales</li>
                <li>Contribuer au développement des communautés visitées à travers des actions solidaires</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nos offres de services Section */}
      <section id="services" className="travel-style">
        <div className="container">
          <h2 style={{ color: '#1B5E20' }}>Nos offres de services</h2>
          <div className="travel-grid">
            <div className="travel-card">
              <img src="/image/hero_new.png" alt="Excursions d'une journée" className="travel-image" />
              <h3>Excursions d’une journée</h3>
              <p>Découvrez les sites emblématiques de la capitale, entre patrimoine royal et histoire vivante.</p>
            </div>

            <div className="travel-card">
              <img src="/image/mountain.png" alt="Escapades culturelles" className="travel-image" />
              <h3>Escapades culturelles (2 jours)</h3>
              <p>Explorez les collines sacrées autour d’Antananarivo et vivez une immersion authentique en milieu rural.</p>
            </div>

            <div className="travel-card">
              <img src="/image/hero.png" alt="Circuits culturels dans le Sud" className="travel-image" />
              <h3>Circuits culturels dans le Sud</h3>
              <p>Partez à l’aventure à la découverte de paysages spectaculaires et de cultures uniques.</p>
            </div>

            <div className="travel-card">
              <img src="/image/maldives.png" alt="Séjours balnéaires à l'Est" className="travel-image" />
              <h3>Séjours balnéaires à l’Est</h3>
              <p>Alliez détente, nature et découverte à l’aide d’une balade sur le canal de Pangalanes et les plus belles côtes de l’Est malgache.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
