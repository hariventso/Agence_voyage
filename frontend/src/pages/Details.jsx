/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Clock, CreditCard, Leaf, Bookmark } from 'lucide-react';
import DetailsHero from '../components/details/DetailsHero';
import DetailsTabs from '../components/details/DetailsTabs';
import DetailsSidebar from '../components/details/DetailsSidebar';
import BookingForm from '../components/details/BookingForm';
import { apiService } from '../services/api';
import { getImageUrl } from '../services/images';
import { useTranslate } from '../i18n/useTranslate';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Details = ({ destinationId }) => {
  const { t } = useTranslate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeTab, setActiveTab] = useState('itineraire');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeDeparture, setActiveDeparture] = useState('Depuis Lyon');
  const [activeOption, setActiveOption] = useState('Option n°1');
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', participants: '2',
    dateDepart: '', duree: '', typeVoyage: 'devis', message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error
  const [dialog, setDialog] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!destinationId) return;
      setLoading(true);
      try {
        const destData = await apiService.getDestination(destinationId);

        if (!destData) throw new Error(t('Destination non trouvée'));
        setDestination(destData);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destinationId, t]);

  useEffect(() => {
    if (!destination) return;
    const pageTitle = `${t(destination.name)} | Explor'Île`;
    const pageDescription = destination.description ? t(destination.description.substring(0, 160)).replace(/\s+/g, ' ').trim() + '...' : `Découvrez les détails du circuit ${t(destination.name)} à Madagascar avec Explor'Île.`;
    document.title = pageTitle;
    const setMeta = (selector, attr, value) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', pageDescription);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDescription);
    setMeta('meta[property="og:image"]', 'content', getImageUrl(destination.image_url, '/image/hero.png'));
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDescription);
    setMeta('meta[name="twitter:image"]', 'content', getImageUrl(destination.image_url, '/image/hero.png'));
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${window.location.origin}${window.location.pathname}#detail-${destinationId}`);
  }, [destination, destinationId, t]);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 400);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.email || !formData.dateDepart) {
      setDialog({ show: true, message: t('Veuillez remplir les champs obligatoires : Nom, Email et Date de départ.') });
      return;
    }

    // Si c'est une réservation : envoi à la base de données
    if (formData.typeVoyage === 'reservation') {
      setFormStatus('submitting');
      try {
        const bookingData = {
          type: 'reservation',
          sender: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          participants: parseInt(formData.participants),
          departure_date: formData.dateDepart,
          duration: formData.duree,
          message: formData.message,
          tour_name: destination.name
        };
        const response = await apiService.createBooking(bookingData);
        if (response) {
          setFormStatus('success');
          setDialog({ show: true, message: t('Votre réservation a été reçue. Nous vous contacterons bientôt !') });
          setFormData({ nom: '', email: '', telephone: '', participants: '2', dateDepart: '', duree: '', typeVoyage: 'devis', message: '' });
        }
      } catch (err) {
        console.error('Erreur lors de la soumission:', err);
        setFormStatus('error');
        setDialog({ show: true, message: t('Erreur lors de l\'envoi de la réservation. Veuillez réessayer.') });
      }
    } else {
      // Si c'est un devis : envoi via WhatsApp
      const whatsappNumber = '261341776169'; // Numéro à adapter
      const text = `${t("Bonjour, je souhaite un devis pour le circuit :")} ${t(destination.name)}. %0A%0A` +
                   `${t("Détails :")} %0A` +
                   `- ${t("Nom")} : ${formData.nom} %0A` +
                   `- ${t("Email")} : ${formData.email} %0A` +
                   `- ${t("Téléphone")} : ${formData.telephone} %0A` +
                   `- ${t("Participants")} : ${formData.participants} %0A` +
                   `- ${t("Date de départ")} : ${formData.dateDepart} %0A` +
                   `- ${t("Message")} : ${formData.message}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
      window.open(whatsappUrl, '_blank');

      setFormStatus('success');
      setFormData({ nom: '', email: '', telephone: '', participants: '2', dateDepart: '', duree: '', typeVoyage: 'devis', message: '' });
    }
  };

  if (loading) return null;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', backgroundColor: '#000', color: '#ff4d4d', height: '100vh' }}>{t("Erreur")}: {error}</div>;
  if (!destination) return <div style={{ padding: '100px', textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh' }}>{t("Destination non trouvée")}</div>;

  return (
    <div className="details-page" style={{ position: 'relative', fontFamily: '"Outfit", sans-serif' }}>
      <DetailsHero isMobile={isMobile} destination={destination} />

      <section className="main-content-section" style={{ backgroundColor: '#fff', position: 'relative', padding: '60px 0' }}>
        <div className="container" style={{
          position: 'relative',
          maxWidth: '1240px',
          width: '90%',
          margin: '0 auto'
        }}>

          {/* Top Departure Tabs */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', scrollbarWidth: 'none' }}>
            {['Depuis Bordeaux', 'Depuis Lyon', 'Depuis Marseille', 'Depuis Paris'].map((city) => (
              <button
                key={city}
                onClick={() => setActiveDeparture(city)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeDeparture === city ? '#2D4A43' : '#F0F1F3',
                  color: activeDeparture === city ? '#fff' : '#4a5568',
                  boxShadow: activeDeparture === city ? '0 4px 10px rgba(45,74,67,0.2)' : 'none',
                  transition: 'all 0.25s',
                  whiteSpace: 'nowrap'
                }}
              >
                {t(city)}
              </button>
            ))}
          </div>

          {/* Sub options */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            {['Option n°1', 'Option n°2'].map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveOption(opt)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: activeOption === opt ? 'none' : '1.5px solid #cbd5e0',
                  backgroundColor: activeOption === opt ? '#2D4A43' : 'transparent',
                  color: activeOption === opt ? '#fff' : '#4a5568',
                  transition: 'all 0.25s'
                }}
              >
                {t(opt)}
              </button>
            ))}
          </div>

          {/* En Bref & Map Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
            gap: '32px',
            marginBottom: '48px',
            alignItems: 'stretch'
          }}>
            {/* En Bref Card */}
            <div style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              padding: '28px',
              backgroundColor: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B3D34', marginBottom: '20px', textAlign: 'center', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.5px' }}>{t("En bref")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ color: '#C21A4B', marginTop: '2px', backgroundColor: '#FFF5F7', padding: '6px', borderRadius: '8px' }}><Calendar size={18} /></div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Durées conseillées :")}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#2d3748', marginTop: '2px' }}>{destination.duration ? `${destination.duration}${t("j")}, ${Math.ceil(destination.duration/2)}${t("j")}, ${destination.duration*2}${t("j")}` : t('2 semaines, 1 semaine, 3 semaines')}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ color: '#C21A4B', marginTop: '2px', backgroundColor: '#FFF5F7', padding: '6px', borderRadius: '8px' }}><Clock size={18} /></div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Heures de transport :")}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#2d3748', marginTop: '2px' }}>~ {destination.duration ? Math.round(destination.duration * 1.5) : 21}{t("h")}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ color: '#C21A4B', marginTop: '2px', backgroundColor: '#FFF5F7', padding: '6px', borderRadius: '8px' }}><CreditCard size={18} /></div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Prix estimé :")}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#2d3748', marginTop: '2px' }}>~ {t(destination.price) || '157 €'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ color: '#2F855A', marginTop: '2px', backgroundColor: '#F0FDF4', padding: '6px', borderRadius: '8px' }}><Leaf size={18} /></div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Impact CO2 :")}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#2F855A', marginTop: '2px' }}>{t("10x moins polluant qu'en avion")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Frame */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              border: '1.5px solid #e2e8f0',
              height: isMobile ? '300px' : 'auto',
              minHeight: '280px',
              position: 'relative'
            }}>
              <iframe
                title={t(`Carte de ${destination.name}`)}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(destination.name + ' Madagascar')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Main layout - 3 columns grid on desktop starting at the tabs section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '60px 1fr 320px',
            gap: isMobile ? '32px' : '40px',
            alignItems: 'start',
            width: '100%',
            paddingTop: '20px'
          }}>
            {/* Column 1: Sticky Social Bar (desktop only) */}
            {!isMobile && (
              <div style={{
                position: 'sticky',
                top: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 10,
                alignSelf: 'start',
                alignItems: 'center'
              }}>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  style={socialIconStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.backgroundColor = '#9d123c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#C21A4B'; }}>
                  <InstagramIcon size={18} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer"
                  style={socialIconStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.backgroundColor = '#9d123c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#C21A4B'; }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                  style={socialIconStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.backgroundColor = '#9d123c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#C21A4B'; }}>
                  <LinkedinIcon size={18} />
                </a>
                <a href="mailto:contact@explorile.mg"
                  style={socialIconStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.backgroundColor = '#9d123c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#C21A4B'; }}>
                  <Mail size={18} />
                </a>
              </div>
            )}

            {/* Column 2: Scrollable Tabs & Itinerary Content */}
            <div style={{ width: '100%' }}>
              <DetailsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={isMobile}
                destination={destination}
                activeDeparture={activeDeparture}
                activeOption={activeOption}
              />
            </div>

            {/* Column 3: Sticky Sidebar (desktop only) */}
            {!isMobile && (
              <DetailsSidebar isMobile={false} destination={destination} />
            )}
          </div>

          {/* Mobile sidebar (below the tabs) */}
          {isMobile && (
            <div style={{ marginTop: '32px' }}>
              <DetailsSidebar isMobile={true} destination={destination} />
            </div>
          )}
        </div>
      </section>


      <BookingForm
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        isMobile={isMobile}
        setFormData={setFormData}
        tourName={destination.name}
      />

      {/* ===== Circuits Similaires ===== */}
      {destinations.length > 0 && (() => {
        // ── Smart Similarity Scoring ──────────────────────────────────────
        const parsePrice = (priceStr) => {
          if (!priceStr) return null;
          const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
          return isNaN(num) ? null : num;
        };

        const extractKeywords = (str) => {
          if (!str) return [];
          return String(str)
            .toLowerCase()
            .split(/[,;\n•\-–|/]+/)
            .map(s => s.trim())
            .filter(s => s.length > 3);
        };

        const currentPrice = parsePrice(destination.price);
        const currentDuration = destination.duration ? parseInt(destination.duration, 10) : null;
        const currentKeywords = [
          ...extractKeywords(destination.highlights),
          ...extractKeywords(destination.description),
          ...extractKeywords(destination.tips)
        ];

        const scoredDestinations = destinations.map(c => {
          let score = 0;
          const reasons = [];

          // 1. Same type (+3)
          if (c.type && destination.type && c.type.trim().toLowerCase() === destination.type.trim().toLowerCase()) {
            score += 3;
            reasons.push('Même type');
          }

          // 2. Similar duration within ±3 days (+2)
          const cDur = c.duration ? parseInt(c.duration, 10) : null;
          if (currentDuration && cDur && Math.abs(cDur - currentDuration) <= 3) {
            score += 2;
            reasons.push('Durée similaire');
          }

          // 3. Similar price within ±30% (+2)
          const cPrice = parsePrice(c.price);
          if (currentPrice && cPrice) {
            const diff = Math.abs(cPrice - currentPrice) / currentPrice;
            if (diff <= 0.30) {
              score += 2;
              reasons.push('Budget similaire');
            }
          }

          // 4. Shared highlight/activity keywords (+1 each, max 3)
          const cKeywords = [
            ...extractKeywords(c.highlights),
            ...extractKeywords(c.description),
            ...extractKeywords(c.tips)
          ];
          let kwMatches = 0;
          currentKeywords.forEach(kw => {
            if (kwMatches < 3 && cKeywords.some(ck => ck.includes(kw) || kw.includes(ck))) {
              kwMatches++;
            }
          });
          if (kwMatches > 0) {
            score += kwMatches;
            reasons.push('Activités communes');
          }

          return { ...c, _score: score, _reasons: reasons };
        });

        const similarCircuits = scoredDestinations
          .sort((a, b) => b._score - a._score)
          .slice(0, 4);
        // ─────────────────────────────────────────────────────────────────

        return (
        <section style={{
          backgroundColor: '#f8f9fa',
          padding: isMobile ? '60px 20px' : '100px 20px',
          color: '#333'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* En-tête */}
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: '#C21A4B',
                fontSize: isMobile ? '1.1rem' : '1.4rem',
                margin: '0 0 8px 0',
                fontWeight: 500
              }}>
                Vous aimerez aussi
              </p>
              <h2 style={{
                fontSize: isMobile ? '28px' : '44px',
                fontFamily: '"Playfair Display", serif',
                color: '#0a2e24',
                fontWeight: 800,
                margin: '0 0 16px 0',
                letterSpacing: '-0.5px'
              }}>
                Circuits Similaires
              </h2>
              <div style={{
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, #C21A4B, #FF8C00)',
                borderRadius: '2px',
                margin: '0 auto'
              }} />
            </div>

            {/* Grille de cartes */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '28px'
            }}>
              {similarCircuits.map((c, i) => {
                const reviewData = [
                  { rating: 5, count: 20 },
                  { rating: 5, count: 12 },
                  { rating: 4, count: 18 },
                  { rating: 5, count: 24 }
                ][i % 4];
                const durationLabel = c.duration ? `${c.duration} JOURS` : '7 JOURS';

                return (
                  <div
                    key={c.id}
                    onClick={() => { window.location.hash = `#detail-${c.id}`; }}
                    style={{
                      position: 'relative',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      height: isMobile ? '240px' : '320px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.18)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Image de fond */}
                    <img
                      src={c.image_url || '/image/mountain.png'}
                      alt={c.name}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        position: 'absolute', top: 0, left: 0, zIndex: 0
                      }}
                    />

                    {/* Gradient sombre */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.88) 100%)',
                      zIndex: 1
                    }} />

                    {/* Contenu */}
                    <div style={{
                      position: 'relative', zIndex: 2, height: '100%',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '24px', boxSizing: 'border-box', color: '#fff'
                    }}>
                      {/* Ligne haute */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1, marginRight: '8px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 700,
                            display: 'inline-flex', alignItems: 'center',
                            gap: '6px', letterSpacing: '0.5px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(6px)',
                            padding: '4px 10px', borderRadius: '20px'
                          }}>
                            <span style={{
                              width: '7px', height: '7px', borderRadius: '50%',
                              backgroundColor: '#FF8C00', display: 'inline-block'
                            }} />
                            {c.type || 'Circuit'}
                          </span>
                          {c._reasons && c._reasons.map((reason, ri) => (
                            <span key={ri} style={{
                              fontSize: '10px', fontWeight: 700,
                              backgroundColor: reason === 'Même type'
                                ? 'rgba(194,26,75,0.75)'
                                : reason === 'Budget similaire'
                                ? 'rgba(255,140,0,0.75)'
                                : reason === 'Durée similaire'
                                ? 'rgba(45,74,67,0.85)'
                                : 'rgba(80,80,80,0.65)',
                              backdropFilter: 'blur(4px)',
                              color: '#fff',
                              padding: '3px 8px',
                              borderRadius: '20px',
                              letterSpacing: '0.3px',
                              whiteSpace: 'nowrap'
                            }}>
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                        <Bookmark size={20} fill="#fff" stroke="none" style={{ opacity: 0.9, flexShrink: 0 }} />
                      </div>

                      {/* Ligne basse */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px'
                      }}>
                        <div style={{ textAlign: 'left' }}>
                          <h3 style={{
                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 800, color: '#fff',
                            margin: '0 0 6px 0',
                            letterSpacing: '-0.3px',
                            textTransform: 'uppercase'
                          }}>
                            {c.name}
                          </h3>
                          <span style={{
                            fontSize: '13px', fontWeight: 700,
                            textDecoration: 'underline', letterSpacing: '0.5px'
                          }}>
                            {c.price} | {durationLabel}
                          </span>
                        </div>

                        {/* Étoiles */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          gap: '6px', fontSize: '11px', fontWeight: 700
                        }}>
                          <span style={{ color: '#FFBC0A', fontSize: '14px', letterSpacing: '1px' }}>
                            {'★'.repeat(reviewData.rating)}
                          </span>
                          <span style={{ color: '#fff', opacity: 0.85 }}>
                            {reviewData.count} AVIS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton voir tous les circuits */}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button
                onClick={() => { window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 36px',
                  backgroundColor: '#0a2e24',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: '"Outfit", sans-serif',
                  letterSpacing: '0.5px',
                  boxShadow: '0 6px 20px rgba(10,46,36,0.25)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#C21A4B';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(194,26,75,0.35)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#0a2e24';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,46,36,0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Voir tous nos circuits →
              </button>
            </div>
          </div>
        </section>
        );
      })()}

      {/* Basic Dialog */}
      {dialog.show && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p>{dialog.message}</p>
            <button onClick={() => setDialog({ show: false, message: '' })} style={buttonStyle}>OK</button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Mobile */}
      {isMobile && showStickyBar && (
        <div style={stickyBarStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#999', display: 'block' }}>{t("À partir de")}</span>
              <span style={{ fontSize: '16px', fontWeight: 800 }}>{t(destination.price)}</span>
            </div>
            <button
              onClick={() => document.getElementById('formulaire-devis')?.scrollIntoView({ behavior: 'smooth' })}
              style={stickyButtonStyle}
            >
              {t("Devis")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const socialIconStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#C21A4B',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.25s ease',
  textDecoration: 'none',
  boxShadow: '0 4px 10px rgba(194,26,75,0.3)'
};

const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '400px', textAlign: 'center' };
const buttonStyle = { backgroundColor: '#0a2e24', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '16px' };
const stickyBarStyle = { position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#fff', padding: '12px 20px', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', zIndex: 1000, borderTop: '1px solid #eee' };
const stickyButtonStyle = { backgroundColor: '#0a2e24', color: '#fff', padding: '10px 20px', borderRadius: '4px', border: 'none', fontWeight: 800, fontSize: '12px' };

export default Details;
