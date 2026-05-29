import { useTranslate } from '../../i18n/useTranslate';

const StatsCounter = ({ isMobile }) => {
  const { t } = useTranslate();

  const stats = [
    { label: t('Clients'), value: '900' },
    { label: t('Circuits'), value: '48' },
    { label: t('Équipe'), value: '120' },
    { label: t("Années d'expérience"), value: '15' }
  ];

  return (
    <section style={{
      position: 'relative',
      padding: isMobile ? '60px 0' : '100px 0',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <img
        src="/image/isalo_window_blog.png"
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
          {t("Doing the right thing, at the right time.")}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '30px' : '40px'
        }}>
          {stats.map((stat, i) => (
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
  );
};

export default StatsCounter;
