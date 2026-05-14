import React from 'react';
import { MapPin, Sparkles, CreditCard, Leaf } from 'lucide-react';

const DetailsSidebar = ({ isMobile, destination }) => {
  return (
    <aside className="sidebar" style={{ 
      padding: '20px 0', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '32px',
      position: 'sticky',
      top: '120px',
      alignSelf: 'start'
    }}>
      {/* Points Forts Card */}
      <div className="points-forts-card" style={{
        backgroundColor: '#fdfdfd',
        padding: isMobile ? '24px 20px' : '40px',
        border: '1px solid #eee',
        borderRadius: '4px',
        marginTop: isMobile ? '0' : '40px'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontFamily: '"Playfair Display", serif',
          textAlign: 'center',
          color: '#1b4d3e',
          marginBottom: '0'
        }}>
          Les points forts
        </h3>
        
        <div style={{
          width: '100%',
          height: '8px',
          margin: '10px auto 30px',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'8\' viewBox=\'0 0 200 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M2 5.5C30 4 60 4.5 90 4.5C120 4.5 150 4 198 2.5\' stroke=\'%23333\' stroke-width=\'3\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}></div>

        <ul style={{ listStyle: 'none', padding: 0, marginTop: '32px' }}>
          {(destination.highlights 
            ? destination.highlights.split('\n').filter(h => h.trim() !== '')
            : [
                `Découverte immersive de ${destination.name}`,
                `Un circuit de type ${destination.type} parfaitement équilibré`,
                "Des paysages uniques et une biodiversité exceptionnelle",
                "Un accompagnement personnalisé par nos experts locaux"
              ]
          ).map((point, index) => (
            <li key={index} style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '32px',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#333',
              alignItems: 'flex-start'
            }}>
              <div style={{ marginTop: '4px', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <span style={{ textAlign: 'justify' }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Nos Garanties Card */}
      <div className="garanties-card" style={{
        backgroundColor: '#fdfdfd',
        padding: isMobile ? '24px 20px' : '40px',
        border: '1px solid #eee',
        borderRadius: '4px'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontFamily: '"Playfair Display", serif',
          textAlign: 'center',
          color: '#1b4d3e',
          marginBottom: '0'
        }}>
          Nos garanties
        </h3>
        
        <div style={{
          width: '100%',
          height: '8px',
          margin: '10px auto 30px',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'8\' viewBox=\'0 0 200 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M2 5.5C30 4 60 4.5 90 4.5C120 4.5 150 4 198 2.5\' stroke=\'%23333\' stroke-width=\'3\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}></div>

        <div className="garanties-grid" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1px',
          backgroundColor: '#eee',
          border: '1px solid #eee',
          marginTop: '32px'
        }}>
          {[
            { label: 'Expertise locale', icon: <MapPin size={24} color="#333" strokeWidth={1.5} /> },
            { label: 'Expérience sur-mesure', icon: <Sparkles size={24} color="#333" strokeWidth={1.5} /> },
            { label: 'Paiement sécurisé', icon: <CreditCard size={24} color="#333" strokeWidth={1.5} /> },
            { label: 'Engagement responsable', icon: <Leaf size={24} color="#333" strokeWidth={1.5} /> }
          ].map((item, index) => (
            <div key={index} style={{
              backgroundColor: '#fdfdfd',
              padding: '24px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px'
            }}>
              {item.icon}
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#333' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DetailsSidebar;
