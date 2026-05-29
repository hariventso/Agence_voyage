import { useTranslate } from '../../i18n/useTranslate';

const AboutHero = ({ isMobile }) => {
  const { t } = useTranslate();

  return (
    <section style={{
      position: 'relative',
      height: isMobile ? '60vh' : '75vh',
      minHeight: isMobile ? '400px' : '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      paddingTop: isMobile ? '80px' : '100px',
    }}>
      {/* Background */}
      <img
        src="/image/about_hero.png"
        alt={t("À propos de Explor'île")}
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
        backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1,
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, padding: isMobile ? '0 20px' : '0 24px' }}>
        <h1 style={{
          fontSize: isMobile ? '2.8rem' : '4.5rem',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: '#FF8C00',
          marginBottom: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          {t("À propos")}
        </h1>
        <p style={{
          color: '#fff',
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          lineHeight: 1.7,
          maxWidth: '760px',
          margin: '0 auto',
          fontWeight: 400,
          textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
        }}>
          {t("Explor'île vous invite à vivre une aventure humaine et sensorielle unique. Spécialistes de la Grande Île, nous concevons des voyages sur mesure qui privilégient l'immersion, le respect des traditions et l'émerveillement face à une biodiversité exceptionnelle.")}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
