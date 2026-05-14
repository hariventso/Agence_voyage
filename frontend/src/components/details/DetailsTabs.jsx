import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';

const DetailsTabs = ({ activeTab, setActiveTab, isMobile, destination }) => {
  const tabs = [
    { label: 'ITINÉRAIRE', key: 'itineraire' },
    { label: 'HÉBERGEMENT', key: 'hebergement' },
    { label: 'BUDGET', key: 'budget' },
    { label: 'NOS CONSEILS', key: 'conseils' }
  ];

  return (
    <div className="content-left" style={{ width: '100%' }}>
      {/* Tabs Header */}
      <div className="tabs-header" style={{
        display: 'flex',
        border: '1px solid #eee',
        borderBottom: 'none',
        borderRadius: '4px 4px 0 0',
        overflowX: 'auto',
        backgroundColor: '#fcfcfc',
        scrollbarWidth: 'none'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: isMobile ? '0 0 auto' : 1,
              padding: isMobile ? '12px 15px' : '24px 10px',
              fontSize: isMobile ? '10px' : '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              border: 'none',
              borderRight: '1px solid #eee',
              backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#2e7d32' : '#333',
              borderBottom: activeTab === tab.key ? '4px solid #2e7d32' : 'none',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="tab-content" style={{ padding: isMobile ? '32px 0' : '48px 0', borderTop: '1px solid #eee', width: '100%' }}>
        {activeTab === 'itineraire' && <ItineraryTab isMobile={isMobile} destination={destination} />}
        {activeTab === 'hebergement' && <AccommodationTab isMobile={isMobile} destination={destination} />}
        {activeTab === 'budget' && <BudgetTab isMobile={isMobile} destination={destination} />}
        {activeTab === 'conseils' && <TipsTab isMobile={isMobile} destination={destination} />}
      </div>
    </div>
  );
};

// Sub-tab components
const ItineraryTab = ({ isMobile, destination }) => (
  <div className="itinerary-tab">
    <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '24px' }}>
      Découvrez {destination.name}
    </h2>
    <div style={{ 
      fontSize: '15px', 
      color: '#444', 
      lineHeight: 1.7, 
      marginBottom: '24px', 
      textAlign: 'justify',
      whiteSpace: 'pre-wrap'
    }}>
      {destination.itinerary || destination.description || 'Plongez dans une aventure inoubliable à travers des paysages à couper le souffle. Ce circuit a été conçu pour vous offrir le meilleur de la destination, entre nature sauvage, culture locale et moments de détente.'}
    </div>
    <p style={{ fontSize: '15px', color: '#444', marginBottom: '24px' }}>
      Type de voyage : <span style={{ color: '#1b4d3e', fontWeight: 600 }}>{destination.type}</span>
    </p>
    <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginBottom: '40px' }}>
      N.B. : Ce voyage est un voyage individuel et sur mesure à personnaliser avec nos conseillers spécialistes.
    </p>

    <h3 style={{ fontSize: '20px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '24px' }}>
      Localisation
    </h3>
    
    <div style={{ 
      marginBottom: isMobile ? '32px' : '48px', 
      borderRadius: '4px', 
      overflow: 'hidden', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
      height: isMobile ? '300px' : '450px',
      position: 'relative'
    }}>
      <iframe
        title={`Carte de ${destination.name}`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(destination.name + ' Madagascar')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
);

const AccommodationTab = ({ isMobile, destination }) => (
  <div className="accommodation-tab">
    <h2 style={{ fontSize: '28px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '24px' }}>
      Vos hébergements pour {destination.name}
    </h2>
    <div style={{ 
      fontSize: '15px', 
      color: '#444', 
      lineHeight: 1.7, 
      marginBottom: '32px', 
      textAlign: 'justify',
      whiteSpace: 'pre-wrap'
    }}>
      {destination.accommodation || "Nous sélectionnons pour vous les meilleurs établissements alliant confort, authenticité et respect de l'environnement. Chaque étape de votre circuit a été pensée pour vous offrir une expérience immersive de qualité."}
    </div>
  </div>
);

const BudgetTab = ({ isMobile, destination }) => (
  <div className="budget-tab">
    <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '24px' }}>
      Détails du Budget
    </h2>
    <div style={{ 
      fontSize: '15px', 
      color: '#444', 
      lineHeight: 1.7, 
      textAlign: 'justify',
      whiteSpace: 'pre-wrap'
    }}>
      {destination.budget || `À partir de ${destination.price}. Ce tarif inclut généralement l'hébergement, les transports locaux et l'assistance. Pour un devis personnalisé, n'hésitez pas à nous contacter.`}
    </div>
  </div>
);

const TipsTab = ({ destination }) => (
  <div className="tips-tab">
    <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '32px' }}>
      Nos conseils pour votre voyage à {destination.name}
    </h2>
    <div style={{ 
      fontSize: '15px', 
      color: '#444', 
      lineHeight: 1.7, 
      textAlign: 'justify',
      whiteSpace: 'pre-wrap'
    }}>
      {destination.tips || "Prévoyez des vêtements adaptés selon la saison. N'oubliez pas votre appareil photo. Respectez la faune et la flore locale. Goûtez aux spécialités culinaires régionales pour une expérience complète."}
    </div>
  </div>
);

export default DetailsTabs;
