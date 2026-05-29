import { Info } from 'lucide-react';
import { getImageUrl } from '../../services/images';
import { useTranslate } from '../../i18n/useTranslate';

const DetailsHero = ({ isMobile, destination }) => {
  const { t } = useTranslate();

  return (
    <section className="details-hero" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("${getImageUrl(destination.image_url, '/image/details_hero.png')}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: isMobile ? '60vh' : '75vh',
      minHeight: isMobile ? '400px' : '600px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
      paddingTop: '80px'
    }}>
      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Breadcrumbs */}
        {!isMobile && (
          <div className="hero-breadcrumbs" style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            position: 'absolute',
            top: '20px',
            left: '24px',
            opacity: 0.9,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            color: '#fff',
            fontWeight: 500
          }}>
            <span>{t("Voyage Madagascar")}</span>
            <span style={{ fontSize: '8px' }}>•</span>
            <span>{t("Circuit")} {t(destination.type)}</span>
            <span style={{ fontSize: '8px' }}>•</span>
            <span>{t(destination.name)}</span>
          </div>
        )}

        <div className="hero-main-content" style={{ maxWidth: '800px', marginTop: isMobile ? '0' : '40px' }}>
          <div className="details-tag" style={{
            display: 'inline-block',
            backgroundColor: '#fff',
            color: '#333',
            padding: '4px 12px',
            borderRadius: '2px',
            fontSize: '11px',
            fontWeight: 800,
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            {t(destination.type)}
          </div>
          
          <h1 style={{
            fontSize: isMobile ? '28px' : 'clamp(40px, 5.5vw, 64px)',
            lineHeight: 1.1,
            marginBottom: '24px',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: '#fff'
          }}>
            {t(destination.name)}
          </h1>
          
          {!isMobile && (
            <p style={{
              fontSize: '18px',
              lineHeight: 1.5,
              color: '#fff',
              opacity: 0.95,
              maxWidth: '650px',
              fontWeight: 500,
              textAlign: 'justify'
            }}>
              {t(destination.description) || t('Découvrez des paysages époustouflants et vivez une expérience unique à travers ce circuit exceptionnel.')}
            </p>
          )}
        </div>
      </div>

      {/* Info Icon in corner */}
      {!isMobile && (
        <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.6 }}>
          <Info size={18} color="#fff" />
        </div>
      )}
    </section>
  );
};

export default DetailsHero;
