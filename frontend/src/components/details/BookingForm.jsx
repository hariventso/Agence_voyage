import React from 'react';
import { User, Mail, Phone, Calendar, Users, MessageSquare, CheckCircle, Send } from 'lucide-react';

const BookingForm = ({ 
  formData, 
  handleFormChange, 
  handleFormSubmit, 
  formStatus, 
  setFormStatus, 
  isMobile, 
  setFormData,
  tourName
}) => {
  return (
    <section id="formulaire-devis" style={{
      backgroundColor: '#f8f7f4',
      padding: isMobile ? '60px 0' : '100px 0',
      borderTop: '1px solid #eee'
    }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            padding: '6px 16px',
            borderRadius: '100px',
            marginBottom: '20px'
          }}>{tourName}</span>
          <h2 style={{
            fontSize: isMobile ? '28px' : '40px',
            fontFamily: '"Playfair Display", serif',
            color: '#0a2e24',
            marginBottom: '16px',
            fontWeight: 700
          }}>Demande de devis & Réservation</h2>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Complétez ce formulaire et cliquez sur le bouton pour démarrer une discussion <strong>WhatsApp</strong> avec notre équipe.
          </p>
        </div>

        {/* Carte du formulaire */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          {/* Bandeau type de demande */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {[
              { val: 'devis', label: '📋 Demande de devis' },
              { val: 'reservation', label: '✈️ Réservation directe' }
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, typeVoyage: opt.val }))}
                style={{
                  flex: 1,
                  padding: '20px',
                  fontSize: isMobile ? '13px' : '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: formData.typeVoyage === opt.val ? '#0a2e24' : '#fff',
                  color: formData.typeVoyage === opt.val ? '#fff' : '#555',
                  transition: 'all 0.3s'
                }}
              >{opt.label}</button>
            ))}
          </div>

          {formStatus === 'success' ? (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={36} color="#2e7d32" />
              </div>
              <h3 style={{ fontSize: '24px', color: '#0a2e24', fontFamily: '"Playfair Display", serif', marginBottom: '12px' }}>
                Demande envoyée avec succès !
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 32px' }}>
                Merci <strong>{formData.nom || 'pour votre demande'}</strong>. Notre équipe vous contactera dans les <strong>24h</strong> pour finaliser votre voyage.
              </p>
              <button
                onClick={() => setFormStatus('idle')}
                style={{ backgroundColor: '#0a2e24', color: '#fff', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >Faire une autre demande</button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{ padding: isMobile ? '32px 20px' : '48px' }}>
              {formStatus === 'error' && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '14px 20px', marginBottom: '32px', color: '#b91c1c', fontSize: '14px', fontWeight: 600 }}>
                  ⚠️ Une erreur est survenue. Veuillez réessayer.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <InputGroup label="Nom complet" name="nom" value={formData.nom} onChange={handleFormChange} icon={<User size={14} />} placeholder="Votre nom et prénom" required />
                <InputGroup label="Email" name="email" value={formData.email} onChange={handleFormChange} icon={<Mail size={14} />} type="email" placeholder="votre@email.com" required />
                <InputGroup label="Téléphone" name="telephone" value={formData.telephone} onChange={handleFormChange} icon={<Phone size={14} />} type="tel" placeholder="+33 6 00 00 00 00" />
                <InputGroup label="Participants" name="participants" value={formData.participants} onChange={handleFormChange} icon={<Users size={14} />} type="number" min="1" />
                <InputGroup label="Date de départ" name="dateDepart" value={formData.dateDepart} onChange={handleFormChange} icon={<Calendar size={14} />} type="date" required />
                <InputGroup label="Durée (jours)" name="duree" value={formData.duree} onChange={handleFormChange} icon={<Calendar size={14} />} type="number" placeholder="Ex: 14" />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}><MessageSquare size={14} /> Message ou précisions</label>
                <textarea 
                  name="message" value={formData.message} onChange={handleFormChange}
                  placeholder="Avez-vous des attentes particulières ? (hébergement, activités, budget...)"
                  style={textareaStyle}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#25D366', // WhatsApp Green
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <Send size={18} /> Contacter sur WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const InputGroup = ({ label, icon, ...props }) => (
  <div>
    <label style={labelStyle}>{icon} {label} {props.required && <span style={{ color: '#e53e3e' }}>*</span>}</label>
    <input {...props} style={inputStyle} />
  </div>
);

const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const textareaStyle = { width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', minHeight: '120px', boxSizing: 'border-box' };

export default BookingForm;
