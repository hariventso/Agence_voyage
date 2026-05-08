import React, { useState, useEffect } from 'react';
import { Phone, Mail, CheckCircle, AlertCircle, Send, Loader } from 'lucide-react';

// Adresse email de destination
const CONTACT_EMAIL = 'contact@domain.com';

function Contact() {
  // --- Contact Form State ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // idle | success

  // --- Newsletter Form State ---
  const [newsletter, setNewsletter] = useState({ name: '', email: '' });
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | success
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Validation ---
  const validateContact = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Le nom est requis.';
    if (!formData.email.trim()) {
      errors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "L'adresse email n'est pas valide.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères.';
    }
    return errors;
  };

  const validateNewsletter = () => {
    const errors = {};
    if (!newsletter.name.trim()) errors.name = 'Requis';
    if (!newsletter.email.trim()) {
      errors.email = 'Requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter.email)) {
      errors.email = 'Email invalide';
    }
    return errors;
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const errors = validateContact();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormStatus('loading');
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: formData.name,
          email: formData.email,
          subject: 'Nouveau message de contact',
          content: formData.message
        })
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const errors = validateNewsletter();
    if (Object.keys(errors).length > 0) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: newsletter.name,
          email: newsletter.email,
          subject: 'Inscription Newsletter',
          content: `${newsletter.name} souhaite s'inscrire à la newsletter.`
        })
      });
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletter({ name: '', email: '' });
      }
    } catch (err) {
      console.error(err);
      setNewsletterStatus('error');
    }
  };

  // --- Shared input style ---
  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '16px',
    borderRadius: '8px',
    border: hasError ? '2px solid #ef4444' : '2px solid transparent',
    backgroundColor: '#fff',
    color: '#333',
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
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingTop: '0' }}>

      {/* Hero Contact */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? '60vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        paddingTop: isMobile ? '120px' : '140px'
      }}>
        <img
          src="/image/mountain.png"
          alt="Contact Background"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: isMobile ? '0 20px' : '0 20px' }}>
          <h1 className="page-hero-h1" style={{
            color: '#FF8C00',
            fontWeight: 700,
            marginBottom: isMobile ? '20px' : '24px',
            marginTop: isMobile ? '20px' : '0',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Contact
          </h1>
          <p style={{ color: '#FFFFFF', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto', fontWeight: 400, textAlign: 'justify' }}>
            Découvrez Madagascar au-delà des sentiers battus. Explor’île vous invite à vivre des expériences uniques, au croisement du tourisme culturel et de l’aventure.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ backgroundColor: '#000000', padding: isMobile ? '60px 0' : '100px 20px', display: 'flex', justifyContent: 'center' }}>
        <div className="container" style={{
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: isMobile ? '40px' : '80px',
          alignItems: 'start'
        }}>

          {/* Left Side: Info */}
          <div style={{ textAlign: 'left', padding: isMobile ? '0 16px' : '0' }}>
            <h2 className="page-hero-h2" style={{ color: '#FF8C00', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '16px', letterSpacing: '-1px', fontSize: isMobile ? '1.8rem' : '3rem' }}>
              Nous aimerions vous entendre
            </h2>
            <h3 style={{ color: '#fff', fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 500, marginBottom: '24px' }}>
              Envoyez-nous un message et nous vous répondrons dès que possible
            </h3>
            <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: 1.6, marginBottom: '40px', maxWidth: '500px', textAlign: 'justify' }}>
              Si vous avez une question ou souhaitez plus d'informations sur l'un de nos circuits, n'hésitez pas à utiliser le formulaire de contact. Nous vous répondrons sous 24 heures.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Phone size={20} color="#FF8C00" />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>+1234567890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Mail size={20} color="#FF8C00" />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{CONTACT_EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div style={{ backgroundColor: '#111', padding: isMobile ? '30px 20px' : '40px', borderRadius: isMobile ? '0' : '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', margin: isMobile ? '0' : '0' }}>

            {/* Success Message */}
            {formStatus === 'success' && (
              <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={22} color="#22c55e" />
                <div>
                  <p style={{ color: '#22c55e', fontWeight: 700, margin: 0 }}>Message envoyé !</p>
                  <p style={{ color: '#86efac', fontSize: '0.9rem', margin: '4px 0 0' }}>Nous avons bien reçu votre demande.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {formStatus === 'error' && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle size={22} color="#ef4444" />
                <div>
                  <p style={{ color: '#ef4444', fontWeight: 700, margin: 0 }}>Erreur d'envoi</p>
                  <p style={{ color: '#fca5a5', fontSize: '0.9rem', margin: '4px 0 0' }}>Impossible de contacter le serveur. Vérifiez que le backend est lancé.</p>
                </div>
              </div>
            )}



            <form onSubmit={handleContactSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name */}
              <div>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Nom *"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle(!!formErrors.name)}
                />
                {formErrors.name && (
                  <p style={errorStyle}><AlertCircle size={13} />{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle(!!formErrors.email)}
                />
                {formErrors.email && (
                  <p style={errorStyle}><AlertCircle size={13} />{formErrors.email}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Votre message *"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ ...inputStyle(!!formErrors.message), resize: 'none' }}
                />
                {formErrors.message && (
                  <p style={errorStyle}><AlertCircle size={13} />{formErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                id="contact-submit"
                type="submit"
                disabled={formStatus === 'loading'}
                style={{
                  backgroundColor: '#FF8C00',
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
                  <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi...</>
                ) : (
                  <><Send size={18} /> Envoyer</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ width: '100%', height: isMobile ? '300px' : '450px', backgroundColor: '#111' }}>
        <iframe
          title="Madagascar Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120757.26084055273!2d47.44773822167969!3d-18.887820699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f0809700000001%3A0x67988344e11f0578!2sAntananarivo!5e0!3m2!1sen!2smg!4v1714809000000!5m2!1sen!2smg"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Newsletter Section */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '60px 16px' : '100px 20px',
        textAlign: 'center',
        minHeight: isMobile ? '350px' : '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img
          src="/image/hero.png"
          alt="Newsletter Background"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <div style={{ marginBottom: '24px' }}>
            <svg width={isMobile ? "40" : "60"} height={isMobile ? "40" : "60"} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-20deg)' }}>
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
          <h2 className="page-section-h2" style={{ color: '#FF8C00', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '12px', fontSize: isMobile ? '1.8rem' : '2.5rem' }}>
            Restons en Contact
          </h2>
          <p style={{ color: '#fff', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 500, marginBottom: '40px' }}>
            Offres Exclusives. Actualités. Directement dans votre Boîte Mail.
          </p>

          {/* Newsletter success */}
          {newsletterStatus === 'success' && (
            <div style={{ backgroundColor: 'rgba(5,46,22,0.9)', border: '1px solid #16a34a', borderRadius: '10px', padding: '16px 24px', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="#22c55e" />
              <span style={{ color: '#22c55e', fontWeight: 700 }}>Inscription confirmée ! Merci.</span>
            </div>
          )}

          {newsletterStatus !== 'success' && (
            <form onSubmit={handleNewsletterSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input
                    id="newsletter-name"
                    type="text"
                    placeholder="Nom"
                    value={newsletter.name}
                    onChange={(e) => setNewsletter(p => ({ ...p, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: '2px solid transparent',
                      backgroundColor: 'rgba(255,255,255,0.75)',
                      backdropFilter: 'blur(5px)',
                      color: '#111',
                      fontWeight: 600,
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Email"
                    value={newsletter.email}
                    onChange={(e) => setNewsletter(p => ({ ...p, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: '2px solid transparent',
                      backgroundColor: 'rgba(255,255,255,0.75)',
                      backdropFilter: 'blur(5px)',
                      color: '#111',
                      fontWeight: 600,
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                id="newsletter-submit"
                type="submit"
                disabled={newsletterStatus === 'loading'}
                style={{
                  backgroundColor: '#fff',
                  color: '#333',
                  border: '2px solid #FF8C00',
                  padding: isMobile ? '12px 30px' : '14px 40px',
                  borderRadius: '12px',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 700,
                  cursor: newsletterStatus === 'loading' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  opacity: newsletterStatus === 'loading' ? 0.7 : 1,
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: 'center'
                }}
              >
                {newsletterStatus === 'loading' ? (
                  <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />Envoi...</>
                ) : (
                  <>S'ABONNER
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF8C00" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

export default Contact;
