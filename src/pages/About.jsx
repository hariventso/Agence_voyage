import React, { useState, useEffect } from 'react';

// Team members will be fetched from API
const staticTeamMembers = [
  {
    name: 'Miora Rakoto',
    role: 'Guide culturelle & Co-fondatrice',
    bio: 'Passionnée par le patrimoine malgache, Miora accompagne les voyageurs depuis plus de 8 ans sur les sentiers authentiques de l\'île.',
    image: '/image/expert1.png',
  },
  {
    name: 'Hery Andriantsoa',
    role: 'Expert circuits & Logistique',
    bio: 'Hery conçoit chaque itinéraire avec précision pour garantir une expérience fluide, sécurisée et inoubliable.',
    image: '/image/hero_new.png',
  },
  {
    name: 'Lalaina Rasoamanana',
    role: 'Spécialiste séjours balnéaires',
    bio: 'Des côtes de Nosy Be à Sainte-Marie, Lalaina vous ouvre les portes des plus belles plages et lagons de Madagascar.',
    image: '/image/maldives.png',
  },
  {
    name: 'Tantely Razafindrakoto',
    role: 'Conseiller aventure & nature',
    bio: 'Tantely est votre référent pour les expéditions en brousse, la découverte de la faune et les rencontres communautaires.',
    image: '/image/mountain.png',
  },
];

const travelReviews = [
  {
    name: 'Jean-Pierre Morel',
    role: 'Client Fidèle',
    rating: 5,
    image: '/image/expert1.png',
    quote: "Un voyage exceptionnel organisé par des mains de maîtres. La découverte des Tsingy reste le moment le plus fort de mon séjour. Merci à toute l'équipe d'Explor'île !"
  },
  {
    name: 'Sarah Jenkins',
    role: 'Voyageuse Solo',
    rating: 5,
    image: '/image/expert3.png',
    quote: "L'organisation était parfaite du début à la fin. Les guides locaux sont extrêmement compétents et passionnés par leur pays. Je me suis sentie en sécurité tout au long du périple."
  },
  {
    name: 'Marc Lefebvre',
    role: 'Aventure en Famille',
    rating: 4,
    image: '/image/expert2.png',
    quote: "Une immersion totale dans la culture malgache. Des paysages à couper le souffle et des rencontres humaines inoubliables. Mes enfants ont adoré la visite des parcs nationaux."
  }
];

function About() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeReview, setActiveReview] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    // Fetch Team
    const fetchTeam = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/team');
        const data = await res.json();
        setTeamMembers(data.length > 0 ? data : staticTeamMembers);
      } catch (err) {
        console.error("Error fetching team:", err);
        setTeamMembers(staticTeamMembers);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();

    // Auto-slide logic
    const interval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % travelReviews.length);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? '60vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        paddingTop: '100px',
      }}>
        {/* Background */}
        <img
          src="/image/mountain.png"
          alt="À propos de Explor'île"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
          }}
        />
        {/* Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.62)', zIndex: 1,
        }} />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: isMobile ? '0 20px' : '0 24px' }}>
          <h1 style={{
            fontSize: isMobile ? '2.8rem' : '4.5rem',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#FF8C00',
            marginBottom: '24px',
          }}>
            À propos
          </h1>
          <p style={{
            color: '#fff',
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            lineHeight: 1.7,
            maxWidth: '760px',
            margin: '0 auto',
            fontWeight: 400,
          }}>
            Explor'île vous invite à vivre une aventure humaine et sensorielle unique. 
            Spécialistes de la Grande Île, nous concevons des voyages sur mesure qui privilégient 
            l'immersion, le respect des traditions et l'émerveillement face à une biodiversité exceptionnelle.
          </p>
        </div>
      </section>

      {/* ══════════════════════════ NOTRE ÉQUIPE ══════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        padding: isMobile ? '60px 0' : '100px 0',
      }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: isMobile ? '48px' : '80px',
          }}>
            {/* Left: Text */}
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{
                fontSize: isMobile ? '2rem' : '3rem',
                fontFamily: "'Playfair Display', serif",
                color: '#FF8C00',
                marginBottom: '24px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}>
                Notre Équipe
              </h2>
              <p style={{
                color: '#fff',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 700,
                lineHeight: 1.6,
                marginBottom: '20px',
              }}>
                Notre agence accompagne les voyageurs depuis plus de 10 ans. 
                Nous mettons tout en œuvre pour vous offrir la meilleure expérience.
              </p>
              <p style={{
                color: '#bbb',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '36px',
                textAlign: 'justify',
              }}>
                Chaque membre de notre équipe est un expert de terrain, formé à la fois aux sciences humaines 
                et à la logistique du voyage. Ensemble, nous élaborons des circuits qui conjuguent découvertes 
                culturelles, rencontres authentiques et moments de détente inoubliables. Notre engagement : 
                respecter l'identité des communautés visitées et valoriser le patrimoine vivant de Madagascar.
              </p>
              <a
                href="#contact"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#FF8C00';
                  e.currentTarget.style.borderColor = '#FF8C00';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#fff';
                }}
              >
                Nous contacter
              </a>
            </div>

            {/* Right: Image */}
            <div style={{
              flex: '1 1 420px',
              borderRadius: '16px',
              overflow: 'hidden',
              maxHeight: isMobile ? '280px' : '420px',
            }}>
              <img
                src="/image/team_photo.png"
                alt="Notre équipe Explor'île"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ NOS EXPERTS ══════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        padding: isMobile ? '60px 0 80px' : '80px 0 120px',
        borderTop: '1px solid #1a1a1a',
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: '#fff',
              fontSize: isMobile ? '1rem' : '1.2rem',
              marginBottom: '8px',
              fontWeight: 400,
            }}>
              Notre meilleure
            </p>
            <h2 style={{
              fontSize: isMobile ? '2.2rem' : '3.5rem',
              fontFamily: "'Playfair Display', serif",
              color: '#FF8C00',
              fontWeight: 700,
              lineHeight: 1.2,
            }}>
              Équipe d'Experts
            </h2>
          </div>

          {/* Team Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '16px' : '24px',
          }}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,140,0,0.15)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Photo */}
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  backgroundColor: '#333',
                }}>
                  <img
                    src={member.image_url || member.image || '/image/placeholder.png'}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{
                  padding: isMobile ? '16px 12px' : '20px',
                  backgroundColor: '#2a2a2a',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <h3 style={{
                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                    fontFamily: "'Playfair Display', serif",
                    color: '#fff',
                    fontWeight: 600,
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    {member.name}
                  </h3>
                  <p style={{
                    color: '#FF8C00',
                    fontSize: isMobile ? '0.7rem' : '0.78rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: 0,
                  }}>
                    {member.role}
                  </p>
                  {!isMobile && (
                    <p style={{
                      color: '#aaa',
                      fontSize: '0.82rem',
                      lineHeight: 1.55,
                      textAlign: 'center',
                      margin: 0,
                    }}>
                      {member.bio}
                    </p>
                  )}

                  {/* Social Icons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '12px',
                  }}>
                    {/* Facebook */}
                      <a
                        key="fb"
                        href={member.facebook_url || "#"}
                        style={{ color: '#888', transition: 'color 0.2s', display: member.facebook_url ? 'flex' : 'none', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.color = '#FF8C00'}
                        onMouseOut={e => e.currentTarget.style.color = '#888'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      </a>,
                      <a
                        key="tw"
                        href={member.twitter_url || "#"}
                        style={{ color: '#888', transition: 'color 0.2s', display: member.twitter_url ? 'flex' : 'none', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.color = '#FF8C00'}
                        onMouseOut={e => e.currentTarget.style.color = '#888'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                      </a>,
                      <a
                        key="ig"
                        href={member.instagram_url || "#"}
                        style={{ color: '#888', transition: 'color 0.2s', display: member.instagram_url ? 'flex' : 'none', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.color = '#FF8C00'}
                        onMouseOut={e => e.currentTarget.style.color = '#888'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                      </a>,
                      <a
                        key="pi"
                        href={member.pinterest_url || "#"}
                        style={{ color: '#888', transition: 'color 0.2s', display: member.pinterest_url ? 'flex' : 'none', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.color = '#FF8C00'}
                        onMouseOut={e => e.currentTarget.style.color = '#888'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                      </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STATS COUNTER ══════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '60px 0' : '100px 0',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background */}
        <img
          src="/image/mountain.png"
          alt="Stats Background"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            opacity: 0.6
          }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            marginBottom: '48px',
            fontWeight: 400
          }}>
            Doing the right thing, at the right time.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '30px' : '40px'
          }}>
            {[
              { label: 'Clients', value: '900' },
              { label: 'Circuits', value: '48' },
              { label: 'Équipe', value: '120' },
              { label: 'Années d\'expérience', value: '15' }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: isMobile ? '2.5rem' : '3.5rem',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '8px'
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#bbb',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ OUR POPULAR TOURS ══════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        padding: isMobile ? '60px 0' : '100px 0'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: isMobile ? '2.2rem' : '3rem',
            fontFamily: "'Playfair Display', serif",
            color: '#FF8C00',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            Nos Circuits Populaires
          </h2>
          <p style={{
            color: '#ccc',
            fontSize: '0.9rem',
            marginBottom: '48px',
            maxWidth: '800px'
          }}>
            Découvrez nos itinéraires les plus prisés, soigneusement conçus pour vous offrir un équilibre parfait entre aventure sauvage, confort hôtelier et immersion culturelle.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '40px' : '60px',
            alignItems: 'center'
          }}>
            {/* Left: Image with Video Button */}
            <div style={{
              flex: 1,
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              width: '100%',
              aspectRatio: '16/10'
            }}>
              <img
                src="/image/maldives.png"
                alt="Tour Video Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '64px', height: '64px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #fff'
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: '15px solid #fff',
                  marginLeft: '4px'
                }} />
              </div>
            </div>

            {/* Right: Tours List */}
            <div style={{ flex: 1, width: '100%' }}>
              {[
                { name: 'Thailand', price: '$599', tags: 'Beach | Hotel | Vehicle' },
                { name: 'North Africa', price: '$800', tags: 'Beach | Hotel | Vehicle' },
                { name: 'South Korea', price: '$650', tags: 'Beach | Hotel | Vehicle' },
                { name: 'Swizzerland', price: '$700', tags: 'Beach | Hotel | Vehicle' }
              ].map((tour, i) => (
                <div key={i} style={{
                  borderBottom: '1px dashed #333',
                  paddingBottom: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{tour.name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF8C00' }}>{tour.price}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#FF8C00', fontWeight: 600, marginBottom: '4px' }}>{tour.tags}</div>
                  <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                    Un voyage immersif combinant détente sur les plages paradisiaques et découverte des traditions locales.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TRAVEL REVIEWS ══════════════════════════ */}
      <section style={{
        backgroundColor: '#000',
        padding: isMobile ? '60px 0 100px' : '80px 0 120px',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: '#fff',
              fontSize: '1.2rem',
              marginBottom: '12px'
            }}>Read The Top</p>
            <h2 style={{
              fontSize: isMobile ? '2.5rem' : '3.5rem',
              fontFamily: "'Playfair Display', serif",
              color: '#FF8C00',
              fontWeight: 600
            }}>Avis Voyageurs</h2>
            <p style={{
              color: '#888',
              fontSize: '0.9rem',
              maxWidth: '800px',
              margin: '24px auto 0',
              lineHeight: 1.6
            }}>
              Ce que disent nos voyageurs. Leurs sourires et leurs souvenirs sont notre plus belle récompense. Découvrez leurs retours d'expérience sur nos différents circuits à travers l'île.
            </p>
          </div>

          {/* Testimonial Card */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: isMobile ? '30px 20px' : '40px',
            textAlign: 'left',
            position: 'relative',
            color: '#000',
            transition: 'all 0.5s ease-in-out',
            opacity: 1,
            transform: 'translateY(0)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <img
                src={travelReviews[activeReview].image}
                alt={travelReviews[activeReview].name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{travelReviews[activeReview].name}</h4>
                <div style={{ fontSize: '0.85rem', color: '#1B5E20', fontWeight: 600 }}>{travelReviews[activeReview].role}</div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {Array.from({ length: travelReviews[activeReview].rating }).map((_, s) => (
                    <span key={s} style={{ color: '#FF8C00' }}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
              <p style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontStyle: 'italic',
                lineHeight: 1.6,
                margin: 0
              }}>
                "{travelReviews[activeReview].quote}"
              </p>
            </div>
          </div>

          {/* Pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
            {travelReviews.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActiveReview(i)}
                style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  backgroundColor: i === activeReview ? '#FF8C00' : '#444',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }} 
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
