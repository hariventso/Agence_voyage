import { useState, useEffect } from 'react';
import { Phone, X, Send, MessageCircle, ArrowLeft, Check } from 'lucide-react';
import { apiService } from '../../services/api';
import { useTranslate } from '../../i18n/useTranslate';

const ContactWidget = () => {
  const { t } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const widget = document.getElementById('noro-contact-widget');
      if (widget && !widget.contains(e.target) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert(t('Veuillez remplir tous les champs.'));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Envoi au backend pour enregistrement
      await apiService.createMessage({
        sender: formData.name,
        email: formData.email,
        subject: t('Message depuis le Widget Flottant'),
        content: formData.message,
      });

      // 2. Ouverture de WhatsApp pour la discussion en direct
      const whatsappNumber = '261341776169'; // Numéro WhatsApp de l'agence
      const whatsappText = encodeURIComponent(
        `Bonjour Raphaël, je m'appelle ${formData.name}. (Email: ${formData.email})\n\nMessage:\n${formData.message}`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;
      window.open(whatsappUrl, '_blank');

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Auto return/close after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      // Fallback: Just open WhatsApp directly even if backend fails
      const whatsappNumber = '261341776169';
      const whatsappText = encodeURIComponent(
        `Bonjour Raphaël, je m'appelle ${formData.name}. (Email: ${formData.email})\n\n${formData.message}`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappText}`, '_blank');
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
        setIsOpen(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="noro-contact-widget"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Contact Card (Popup Box) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '85px',
            right: '0',
            width: '330px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            color: '#333333',
            animation: 'noroWidgetSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
            boxSizing: 'border-box',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fermer"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#f1f3f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#868e96',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
              e.currentTarget.style.color = '#343a40';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f3f5';
              e.currentTarget.style.color = '#868e96';
            }}
          >
            <X size={16} />
          </button>

          {/* Inject style for keyframes if not defined in external CSS */}
          <style>{`
            @keyframes noroWidgetSlideUp {
              from {
                opacity: 0;
                transform: translateY(12px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes noroPulseGreen {
              0% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
              }
              70% {
                box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
              }
            }
          `}</style>

          {!showForm ? (
            /* Welcome / Presentation View */
            <>
              {/* Heading "Bonjour" */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#4B3621', // Deep warm brown
                  margin: '0 0 -4px 0',
                  lineHeight: '1.2',
                }}
              >
                {t('Bonjour')}
              </h3>

              {/* Message text */}
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#495057',
                  margin: '0',
                  textAlign: 'left',
                }}
              >
                {t(
                  'Je suis Raphaël Andriamanantena de "Détours Madagascar Voyages". Envoyez-nous votre demande et nous vous répondrons sous 48h.'
                )}
              </p>

              {/* Action Button: Écrire un message */}
              <button
                onClick={() => setShowForm(true)}
                style={{
                  backgroundColor: '#FFC000', // Premium warm golden yellow
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(255, 192, 0, 0.25)',
                  transition: 'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#E6AC00';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 192, 0, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC000';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 192, 0, 0.25)';
                }}
              >
                <MessageCircle size={18} />
                {t('Écrire un message')}
              </button>

              {/* Separator line */}
              <div
                style={{
                  height: '1px',
                  backgroundColor: '#e9ecef',
                  width: '100%',
                  margin: '4px 0',
                }}
              />

              {/* Phone Info Section */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#868e96',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  <Phone size={12} />
                  <span>{t("Prix d'un appel local")}</span>
                </div>
                <a
                  href="tel:+33159169711"
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#212529',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#FFC000';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#212529';
                  }}
                >
                  +33 1 59 16 97 11
                </a>
              </div>
            </>
          ) : (
            /* Contact Form View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    color: '#868e96',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f5')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <ArrowLeft size={16} />
                </button>
                <h4 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#212529' }}>
                  {t('Votre message')}
                </h4>
              </div>

              {submitSuccess ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 0',
                    gap: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#e6fcf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0ca678',
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <p style={{ margin: '0', fontWeight: '700', color: '#0ca678', fontSize: '15px' }}>
                    {t('Message envoyé !')}
                  </p>
                  <p style={{ margin: '0', color: '#868e96', fontSize: '13px' }}>
                    {t('Redirection WhatsApp en cours...')}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder={t('Nom complet')}
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={t('Adresse email')}
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <textarea
                    name="message"
                    placeholder={t('Votre demande (destinations, dates, envies...)')}
                    required
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: '#25D366', // WhatsApp Green
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '700',
                      padding: '11px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      border: 'none',
                      transition: 'background-color 0.2s',
                      opacity: isSubmitting ? 0.8 : 1,
                      marginTop: '4px',
                    }}
                    onMouseOver={(e) => {
                      if (!isSubmitting) e.currentTarget.style.backgroundColor = '#1ebe57';
                    }}
                    onMouseOut={(e) => {
                      if (!isSubmitting) e.currentTarget.style.backgroundColor = '#25D366';
                    }}
                  >
                    <Send size={14} />
                    {isSubmitting ? t('Envoi...') : t('Envoyer sur WhatsApp')}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button (Avatar) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setShowForm(false); // Reset to info panel on open
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contacter Raphaël"
        style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          border: '3px solid #ffffff',
          backgroundColor: '#ffffff',
          boxShadow: isHovered 
            ? '0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 4px rgba(255, 192, 0, 0.15)' 
            : '0 6px 18px rgba(0, 0, 0, 0.18)',
          cursor: 'pointer',
          padding: '0',
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
          transform: isHovered ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
          outline: 'none',
        }}
      >
        {/* Avatar Image */}
        <img
          src="/image/noro_avatar.png"
          alt="Raphaël Andriamanantena"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            // Fallback if avatar file is not readable or fails to load
            e.target.src = '/image/expert1.png';
          }}
        />

        {/* Active status indicator dot (pulsing green dot) */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            border: '2px solid #ffffff',
            animation: 'noroPulseGreen 2s infinite',
          }}
        />
      </button>
    </div>
  );
};

export default ContactWidget;
