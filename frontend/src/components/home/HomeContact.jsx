import { useState, useEffect } from 'react';
import { Phone, Mail, CheckCircle, AlertCircle, Send, Loader } from 'lucide-react';
import { apiService } from '../../services/api';
import { useTranslate } from '../../i18n/useTranslate';

const CONTACT_EMAIL = 'contact@domain.com';

const HomeContact = () => {
  const { t } = useTranslate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('Le nom est requis.');
    if (!formData.email.trim()) {
      errors.email = t("L'email est requis.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("L'adresse email n'est pas valide.");
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = t('Le message doit contenir au moins 10 caractères.');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus('loading');
    try {
      // 1. Enregistrement en base de données pour le dashboard admin
      await apiService.createMessage({
        sender: formData.name,
        email: formData.email,
        subject: t("Contact depuis la page d'accueil"),
        content: formData.message
      });

      setFormStatus('success');

      // 2. Ouverture automatique de WhatsApp
      const whatsappNumber = '261341776169'; // Numéro Explor'île
      const text = `Bonjour, je m'appelle ${formData.name}. %0AEmail: ${formData.email} %0A%0A${formData.message}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
      window.open(whatsappUrl, '_blank');

      // Reset formulaire
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Erreur d\'envoi du message:', err);
      setFormStatus('error');
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '16px',
    borderRadius: '8px',
    border: hasError ? '2px solid #ef4444' : '2px solid #333',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.8rem',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  return (
    <section style={{
      backgroundColor: '#0a0a0a',
      padding: isMobile ? '60px 20px' : '100px 20px',
      borderTop: '1px solid #1a1a1a',
      color: '#fff'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: isMobile ? '40px' : '80px',
          alignItems: 'start'
        }}>
          {/* Côté gauche : Infos de Contact */}
          <div style={{ textAlign: 'left' }}>
            <span style={{
              color: '#FF8C00',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '16px'
            }}>
              {t("Nous Contacter")}
            </span>
            <h2 style={{
              fontSize: isMobile ? '28px' : '42px',
              fontFamily: "'Playfair Display', serif",
              color: '#fff',
              marginBottom: '24px',
              lineHeight: 1.2,
              fontWeight: 700
            }}>
              {t("Discutons de votre projet de voyage")}
            </h2>
            <p style={{
              color: '#bbb',
              fontSize: '1rem',
              lineHeight: 1.7,
              marginBottom: '40px',
              textAlign: 'justify'
            }}>
              {t("Vous avez des questions sur un circuit, des envies de personnalisation ou besoin d'assistance pour préparer votre voyage à Madagascar ? Remplissez ce formulaire et démarrez instantanément la discussion avec notre équipe sur WhatsApp.")}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  backgroundColor: 'rgba(255,140,0,0.1)',
                  padding: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={20} color="#FF8C00" />
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>{t("Téléphone / WhatsApp")}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, margin: '2px 0 0' }}>034 17 761 69</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  backgroundColor: 'rgba(255,140,0,0.1)',
                  padding: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Mail size={20} color="#FF8C00" />
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>{t("Email")}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, margin: '2px 0 0' }}>{CONTACT_EMAIL}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Côté droit : Formulaire */}
          <div style={{
            backgroundColor: '#111',
            padding: isMobile ? '30px 20px' : '40px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid #1a1a1a'
          }}>
            
            {/* Status alerts */}
            {formStatus === 'success' && (
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle size={22} color="#22c55e" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#22c55e', fontWeight: 700, margin: 0 }}>{t("Message enregistré !")}</p>
                  <p style={{ color: '#86efac', fontSize: '0.9rem', margin: '4px 0 0' }}>{t("WhatsApp va s'ouvrir pour initier la discussion en ligne.")}</p>
                </div>
              </div>
            )}

            {formStatus === 'error' && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertCircle size={22} color="#ef4444" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#ef4444', fontWeight: 700, margin: 0 }}>{t("Erreur temporaire")}</p>
                  <p style={{ color: '#fca5a5', fontSize: '0.9rem', margin: '4px 0 0' }}>{t("Le message n'a pas pu être enregistré dans le dashboard. Réessayez ou contactez-nous par WhatsApp.")}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <input
                  id="home-contact-name"
                  type="text"
                  name="name"
                  placeholder={t("Votre nom *")}
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle(!!formErrors.name)}
                />
                {formErrors.name && (
                  <p style={errorStyle}><AlertCircle size={13} />{formErrors.name}</p>
                )}
              </div>

              <div>
                <input
                  id="home-contact-email"
                  type="email"
                  name="email"
                  placeholder={t("Votre email *")}
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle(!!formErrors.email)}
                />
                {formErrors.email && (
                  <p style={errorStyle}><AlertCircle size={13} />{formErrors.email}</p>
                )}
              </div>

              <div>
                <textarea
                  id="home-contact-message"
                  name="message"
                  placeholder={t("Votre message (minimum 10 caractères) *")}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ ...inputStyle(!!formErrors.message), resize: 'none' }}
                />
                {formErrors.message && (
                  <p style={errorStyle}><AlertCircle size={13} />{formErrors.message}</p>
                )}
              </div>

              <button
                id="home-contact-submit"
                type="submit"
                disabled={formStatus === 'loading'}
                style={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: formStatus === 'loading' ? 0.7 : 1
                }}
              >
                {formStatus === 'loading' ? (
                  <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />{t("Envoi en cours...")}</>
                ) : (
                  <><Send size={18} />{t("Discuter sur WhatsApp")}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeContact;
