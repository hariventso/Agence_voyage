import React from 'react';

const HomeAbout = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 style={{ color: '#1B5E20' }}>Une véritable immersion au cœur de l’âme malgache</h2>
            <p style={{ textAlign: 'justify' }}>Alors, partez à la rencontre d’un patrimoine vivant exceptionnel : traditions, danses et chants, modes de vie ruraux, riziculture, pêche artisanale, sans oublier les croyances et les sites sacrés qui façonnent l’identité de l’île.</p>
            <p style={{ textAlign: 'justify' }}>Chaque circuit est soigneusement élaboré et encadré par des professionnels passionnés, pour allier recherches scientifiques, découvertes, distractions et moments de détente.</p>
          </div>
          <div className="about-image">
            <img src="/image/madagascar_river_boat.png" alt="Pirogue Malgache sur une rivière" loading="lazy" style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
