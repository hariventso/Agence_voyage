import { useState, useEffect } from 'react';
import { MapPin, Sparkles, Home, Shield } from 'lucide-react';
import { useTranslate } from '../../i18n/useTranslate';

const HomeFeatures = () => {
  const { t } = useTranslate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      icon: <MapPin size={32} color="#2e7d32" />,
      title: "Une expérience authentique",
      description: "Plongez dans la vie locale et découvrez Madagascar de l’intérieur"
    },
    {
      icon: <Sparkles size={32} color="#2e7d32" />,
      title: "Un contenu enrichissant",
      description: "Des circuits inspirés de recherches en histoire, culture et patrimoine"
    },
    {
      icon: <Home size={32} color="#2e7d32" />,
      title: "Des guides experts",
      description: "Des guides-conférenciers pour donner du sens à chaque visite"
    },
    {
      icon: <Shield size={32} color="#2e7d32" />,
      title: "Un tourisme responsable",
      description: "Des actions concrètes pour soutenir les communautés locales"
    }
  ];

  return (
    <section style={{ backgroundColor: '#fff', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '36px', 
            color: '#0a2e24', 
            fontFamily: '"Playfair Display", serif',
            marginBottom: '16px' 
          }}>
            {t("Pourquoi choisir Explor’île ?")}
          </h2>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {t("Nous mettons tout en œuvre pour faire de votre séjour à Madagascar une expérience inoubliable et sans souci.")}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
          gap: '30px' 
        }}>
          {features.map((f, i) => (
            <div key={i} style={{ 
              padding: '40px 30px', 
              borderRadius: '12px', 
              border: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              textAlign: 'left'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
            >
              <div style={{ marginBottom: '20px' }}>
                {f.icon}
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                color: '#0a2e24', 
                marginBottom: '15px',
                fontWeight: 700 
              }}>
                {t(f.title)}
              </h3>
              <p style={{ 
                fontSize: '15px', 
                color: '#666', 
                lineHeight: 1.6,
                margin: 0 
              }}>
                {t(f.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
