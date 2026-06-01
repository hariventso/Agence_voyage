import { useState, useEffect } from 'react';
import { useTranslate } from '../../i18n/useTranslate';

const HomeFounder = () => {
  const { t } = useTranslate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section style={{
      backgroundColor: '#000',
      padding: isMobile ? '60px 20px' : '100px 20px',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '40px' : '80px',
        }}>
          {/* Portrait du fondateur */}
          <div style={{
            flex: '1 1 400px',
            width: '100%',
            maxWidth: '450px',
            position: 'relative'
          }}>
            {/* Décoration d'arrière-plan */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '-15px',
              right: '15px',
              bottom: '15px',
              border: '2px solid #FF8C00',
              borderRadius: '24px',
              zIndex: 0
            }}></div>
            
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(255,140,0,0.15)',
              position: 'relative',
              zIndex: 1,
              aspectRatio: '3/4',
              backgroundColor: '#111'
            }}>
              <img
                src="/image/founder.jpg"
                alt="Co-fondateur d'Explor'île"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '24px',
                textAlign: 'center'
              }}>
                <span style={{
                  color: '#FF8C00',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  {t("Co-fondateur & Directeur")}
                </span>
              </div>
            </div>
          </div>

          {/* Message du fondateur */}
          <div style={{
            flex: '1 1 500px',
            textAlign: 'left'
          }}>
            <span style={{
              color: '#FF8C00',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '16px'
            }}>
              {t("Le Mot du Fondateur")}
            </span>
            <h2 style={{
              fontSize: isMobile ? '28px' : '42px',
              fontFamily: "'Playfair Display', serif",
              color: '#fff',
              marginBottom: '30px',
              lineHeight: 1.2,
              fontWeight: 700
            }}>
              {t("Partager l'authenticité de Madagascar")}
            </h2>
            <div style={{
              color: '#ccc',
              fontSize: isMobile ? '15px' : '16px',
              lineHeight: 1.8,
              textAlign: 'justify'
            }}>
              <p style={{ marginBottom: '20px' }}>
                "{t("Passionné par le patrimoine vivant et la biodiversité de notre belle île, j'ai créé Explor'île avec l'ambition de proposer une nouvelle manière de voyager. Une approche plus humaine, plus responsable et profondément authentique.")}"
              </p>
              <p style={{ marginBottom: '24px' }}>
                "{t("Notre démarche s'appuie sur des recherches approfondies, la valorisation des savoirs locaux et la collaboration directe avec les communautés hôtes. Chaque itinéraire est une passerelle tendue entre les cultures. En choisissant Explor'île, vous vivez une expérience enrichissante tout en contribuant activement à la préservation du patrimoine malgache.")}"
              </p>
            </div>
            
            {/* Signature */}
            <div style={{
              marginTop: '40px',
              borderTop: '1px solid #222',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px',
                fontWeight: 600,
                color: '#fff',
                fontStyle: 'italic'
              }}>
                Raphaël Andriamanantena
              </span>
              <span style={{
                color: '#888',
                fontSize: '13px',
                fontWeight: 500
              }}>
                {t("Co-fondateur & Guide d'Explor'île")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFounder;
