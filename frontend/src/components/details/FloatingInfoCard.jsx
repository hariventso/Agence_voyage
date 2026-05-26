import React from 'react';
import { Tag, Clock } from 'lucide-react';

const FloatingInfoCard = ({ isMobile, destination }) => {
  return (
    <div className="floating-info-card" style={{
      position: isMobile ? 'relative' : 'absolute',
      right: isMobile ? '0' : '24px',
      top: isMobile ? '-20px' : '-200px',
      backgroundColor: '#fff',
      padding: isMobile ? '24px 20px' : '28px 32px',
      borderRadius: isMobile ? '8px' : '4px', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
      width: isMobile ? '100%' : '360px',
      margin: isMobile ? '0 auto 32px' : '0',
      color: '#333',
      zIndex: 30,
      textAlign: 'center'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontFamily: '"Playfair Display", serif',
        color: '#1b4d3e',
        marginBottom: '0',
        fontWeight: 600
      }}>
        {destination.name}
      </h3>
      
      <div style={{
        width: '160px',
        height: '8px',
        margin: '8px auto 20px',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'10\' viewBox=\'0 0 200 10\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M2 7C40 5 80 5 120 5C150 5 180 4.5 198 3\' stroke=\'%23333\' stroke-width=\'3\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain'
      }}></div>

      <div className="info-row" style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '16px' : '24px', marginTop: '12px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', marginBottom: '4px' }}>
            <Tag size={16} strokeWidth={2.5} />
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>À partir de</span>
          </div>
          <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: '#333' }}>{destination.price}</div>
        </div>
        
        <div style={{ width: '1px', backgroundColor: '#eee' }}></div>

        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', marginBottom: '4px' }}>
            <Clock size={16} strokeWidth={2.5} />
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Durée</span>
          </div>
          <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: '#333' }}>
            {destination.duration ? `${destination.duration} j` : 'Sur demande'}
          </div>
        </div>
      </div>

      <button style={{
        width: '100%',
        backgroundColor: '#0a2e24',
        color: '#fff',
        padding: '13px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#154a3a'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#0a2e24'}
      onClick={() => {
        document.getElementById('formulaire-devis')?.scrollIntoView({ behavior: 'smooth' });
      }}
      >
        Demander un devis
      </button>
    </div>
  );
};

export default FloatingInfoCard;
