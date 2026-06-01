import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../services/images';
import { useTranslate } from '../../i18n/useTranslate';

const defaultServices = [
  {
    id: 'default-1',
    name: 'Circuit Culturel',
    description: 'Plongez au cœur de la culture malgache à travers des rencontres authentiques avec les communautés locales.',
    image_url: '/image/isalo_destination.png',
  },
  {
    id: 'default-2',
    name: 'Séjour Balnéaire',
    description: 'Détendez-vous sur les plus belles plages de Madagascar, des eaux cristallines de Nosy Be aux côtes sauvages.',
    image_url: '/image/home_beach_hero.png',
  },
  {
    id: 'default-3',
    name: 'Aventure & Nature',
    description: 'Explorez les paysages époustouflants de Madagascar : randonnées dans les canyons, trekking et rencontres sauvages.',
    image_url: '/image/beach_sunset_hero.png',
  },
];

/* ── Carte individuelle ── */
const ServiceCard = ({ service }) => {
  const { t } = useTranslate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Naviguer vers la page destinations filtrée par ce service (routing hash de l'app)
    window.location.hash = `destinations?service=${encodeURIComponent(service.name)}`;
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        aspectRatio: '1/1',
        width: '100%',
        cursor: 'pointer',
        boxShadow: isHovered
          ? '0 20px 45px rgba(0,0,0,0.22)'
          : '0 8px 24px rgba(0,0,0,0.08)',
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Image de fond avec effet de zoom */}
      <img
        src={getImageUrl(service.image_url, '/image/hero_new.png')}
        alt={t(service.name)}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* Overlay de base */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isHovered
          ? 'linear-gradient(to top, rgba(10,46,36,0.88) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.1) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)',
        zIndex: 1,
        transition: 'background 0.45s ease',
      }} />

      {/* Contenu */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '28px',
        boxSizing: 'border-box',
      }}>

        {/* Nom du service */}
        <h3 style={{
          color: '#ffffff',
          fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {t(service.name)}
        </h3>

        {/* Description — visible au hover */}
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          margin: '0',
          maxHeight: isHovered ? '80px' : '0px',
          opacity: isHovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.35s ease',
        }}>
          {t(service.description)}
        </p>
      </div>
    </div>
  );
};

/* ── Section principale ── */
const HomeServiceOffer = ({ loading, services }) => {
  const { t } = useTranslate();
  const displayServices = (!loading && (!services || services.length === 0))
    ? defaultServices
    : (services || defaultServices);

  const slicedServices = displayServices.slice(0, 3);

  const [mobileView, setMobileView] = useState(window.innerWidth < 640);
  const [tabletView, setTabletView] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 640);
      setTabletView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="services" style={{
      backgroundColor: '#ffffff',
      padding: mobileView ? '60px 20px' : '100px 0',
      overflow: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            color: '#FF8C00',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            {t("Ce que nous proposons")}
          </p>
          <h2 style={{
            fontSize: mobileView ? '28px' : '48px',
            color: '#0a2e24',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.2,
          }}>
            {t("Nos offres de services")}
          </h2>
        </div>

        {/* Grille */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '1rem' }}>
            {t("Chargement des offres...")}
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: mobileView ? '1fr' : tabletView ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: '28px',
          }}>
            {slicedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* Bouton "En savoir plus" global au bas */}
        {!loading && displayServices.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a
              href="#destinations"
              onClick={e => {
                e.preventDefault();
                window.location.hash = 'destinations';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FF8C00',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '100px',
                boxShadow: '0 8px 24px rgba(255, 140, 0, 0.3)',
                transition: 'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
                letterSpacing: '0.5px',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#e67e00';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 140, 0, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#FF8C00';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 140, 0, 0.3)';
              }}
            >
              {t("En savoir plus")}
              <ArrowRight size={18} />
            </a>
          </div>
        )}

      </div>
    </section>
  );
};

export default HomeServiceOffer;
