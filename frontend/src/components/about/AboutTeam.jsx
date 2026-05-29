import { useTranslate } from '../../i18n/useTranslate';

const AboutTeam = ({ isMobile }) => {
  const { t } = useTranslate();

  return (
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
              {t("Notre Équipe")}
            </h2>
            <p style={{
              color: '#fff',
              fontSize: isMobile ? '1rem' : '1.1rem',
              fontWeight: 700,
              lineHeight: 1.6,
              marginBottom: '20px',
            }}>
              {t("Notre agence accompagne les voyageurs depuis plus de 10 ans. Nous mettons tout en œuvre pour vous offrir la meilleure expérience.")}
            </p>
            <p style={{
              color: '#bbb',
              fontSize: '0.95rem',
              lineHeight: 1.75,
              marginBottom: '36px',
              textAlign: 'justify',
            }}>
              {t("Chaque membre de notre équipe est un expert de terrain, formé à la fois aux sciences humaines et à la logistique du voyage. Ensemble, nous élaborons des circuits qui conjuguent découvertes culturelles, rencontres authentiques et moments de détente inoubliables. Notre engagement : respecter l'identité des communautés visitées et valoriser le patrimoine vivant de Madagascar.")}
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
              {t("Nous contacter")}
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
              alt={t("Notre équipe Explor'île")}
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
  );
};

export default AboutTeam;
