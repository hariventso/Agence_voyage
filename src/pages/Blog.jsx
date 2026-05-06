import React from 'react';

function Blog() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingTop: '0' }}>
      
      {/* Hero Blog */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? '40vh' : '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        paddingTop: isMobile ? '120px' : '120px' // For navbar space
      }}>
        {/* Background Image */}
        <img 
          src="/image/mountain.png" 
          alt="Blog Background" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }} 
        />
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1
        }}></div>

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: isMobile ? '0 20px' : '0 20px' }}>
          <h1 className="page-hero-h1" style={{
            color: '#FF8C00', 
            fontWeight: 700,
            marginBottom: isMobile ? '20px' : '24px',
            marginTop: isMobile ? '20px' : '0',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: isMobile ? '2.5rem' : '4.5rem'
          }}>
            Blog
          </h1>
          <p style={{
            color: '#FFFFFF',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: '800px',
            margin: '0 auto',
            fontWeight: 400,
            textAlign: 'justify'
          }}>
            Découvrez Madagascar à travers des récits authentiques, pour une immersion au cœur de l’âme malgache.
          </p>
        </div>
      </section>

      {/* Blog Feed Section (Placeholder for now) */}
      <section style={{
        backgroundColor: '#000000',
        padding: isMobile ? '60px 16px' : '100px 20px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 className="page-section-h2" style={{
            color: '#FF8C00',
            fontWeight: 600,
            marginBottom: '60px'
          }}>
            Derniers Articles
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
            gap: '40px',
            textAlign: 'left'
          }}>
            {/* Blog Post 1 */}
            <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <img src="/image/hero.png" alt="Blog 1" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Aventure</span>
                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>À la découverte des trésors cachés de Madagascar</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Explorez les paysages préservés de l'Île Rouge. Des cascades secrètes aux villages reculés, découvrez ce qui fait de Madagascar une destination unique pour les explorateurs.
                </p>
                <a href="#post-1" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', paddingBottom: '2px', fontSize: '0.9rem' }}>LIRE LA SUITE</a>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <img src="/image/mountain.png" alt="Blog 2" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Culture</span>
                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>Guide des traditions locales malgaches</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Plongez dans le riche tissu de la culture malgache. Apprenez-en plus sur les 'Fady' (tabous), la musique traditionnelle et l'accueil chaleureux de la population locale.
                </p>
                <a href="#post-2" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', paddingBottom: '2px', fontSize: '0.9rem' }}>LIRE LA SUITE</a>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <img src="/image/hero_new.png" alt="Blog 3" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Nature</span>
                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>Observation des lémuriens : Guide du débutant</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Rencontrez les habitants les plus emblématiques de l'île. Découvrez où et quand observer les différentes espèces de lémuriens dans leur habitat naturel.
                </p>
                <a href="#post-3" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', paddingBottom: '2px', fontSize: '0.9rem' }}>LIRE LA SUITE</a>
              </div>
            </div>

            {/* Blog Post 4 */}
            <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <img src="/image/maldives.png" alt="Blog 4" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Plages</span>
                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>Nosy Be : L'île aux parfums</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Explorez les eaux turquoise et les plantations d'ylang-ylang de Nosy Be. La destination parfaite pour les amateurs de soleil et de plongée.
                </p>
                <a href="#post-4" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', paddingBottom: '2px', fontSize: '0.9rem' }}>LIRE LA SUITE</a>
              </div>
            </div>

            {/* Blog Post 5 */}
            <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <img src="/image/mountain.png" alt="Blog 5" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Tourisme</span>
                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>L'Allée des Baobabs : Un spectacle naturel</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Marchez parmi les géants. Découvrez l'histoire et la magie de l'un des paysages naturels les plus photographiés au monde.
                </p>
                <a href="#post-5" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', paddingBottom: '2px', fontSize: '0.9rem' }}>LIRE LA SUITE</a>
              </div>
            </div>

            {/* Blog Post 6 */}
            <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <img src="/image/hero.png" alt="Blog 6" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Gastronomie</span>
                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>Saveurs de Madagascar : Les plats incontournables</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify' }}>
                  Du Romazava au Ravitoto, explorez les saveurs de Madagascar. Un guide des plats à essayer absolument pour tout amateur de cuisine.
                </p>
                <a href="#post-6" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', paddingBottom: '2px', fontSize: '0.9rem' }}>LIRE LA SUITE</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Blog;
