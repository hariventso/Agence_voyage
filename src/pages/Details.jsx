import React, { useState, useEffect } from 'react';
import { Clock, Tag, MapPin, ChevronRight, Share2, Heart, Calendar, CheckCircle, Info, Sparkles, CreditCard, Leaf, Send, User, Mail, Phone, Users, MessageSquare } from 'lucide-react';

const Details = () => {
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeTab, setActiveTab] = useState('hébergement');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '', participants: '2', dateDepart: '', duree: '', typeVoyage: 'devis', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error
  const [dialog, setDialog] = useState({ show: false, message: '' });

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
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
      setDialog({ show: true, message: 'Veuillez remplir les champs obligatoires : Nom, Email et Date de départ.' });
      return;
    }
    setFormStatus('submitting');
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.typeVoyage,
          sender: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          participants: parseInt(formData.participants),
          departure_date: formData.dateDepart,
          duration: formData.duree,
          message: formData.message,
          tour_name: "L'été indien : autotour au Canada en automne" // À rendre dynamique plus tard
        }),
      });
      if (response.ok) {
        setFormStatus('success');
        setFormData({ nom: '', email: '', telephone: '', participants: '2', dateDepart: '', duree: '', typeVoyage: 'devis', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="details-page" style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section className="details-hero" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("/image/details_hero.png")',
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
              <span>Voyage Canada</span>
              <span style={{ fontSize: '8px' }}>•</span>
              <span>Autotour au Canada</span>
              <span style={{ fontSize: '8px' }}>•</span>
              <span>Le Québec & Montréal</span>
              <span style={{ fontSize: '8px' }}>•</span>
              <span>L'été indien : autotour au Canada en automne</span>
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
              Eté indien
            </div>
            
            <h1 style={{
              fontSize: isMobile ? '28px' : 'clamp(40px, 5.5vw, 64px)',
              lineHeight: 1.1,
              marginBottom: '24px',
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#fff'
            }}>
              L'été indien : autotour au Canada en automne
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
                En plus de découvrir les couleurs quasi éblouissantes de l'été indien, vous découvrez au cours de votre autotour au Québec des villes, des parcs et des sites parmi les plus incontournables de la région !
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

      {/* Overlapping Content Section */}
      <section className="main-content-section" style={{ backgroundColor: '#fff', position: 'relative', minHeight: '1000px' }}>
        <div className="container" style={{ position: 'relative', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          
          {/* Floating Card - Overlapping */}
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
              Autotour au Canada
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
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: '#333' }}>1980€/pers</div>
              </div>
              
              <div style={{ width: '1px', backgroundColor: '#eee' }}></div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', marginBottom: '4px' }}>
                  <Clock size={16} strokeWidth={2.5} />
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Durée</span>
                </div>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: '#333' }}>14 jours / 13 nuits</div>
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
            >
              Demander un devis
            </button>
          </div>

          {/* Main Body Content (Tabs + Tab Content + Sidebar) */}
          <div className="details-body-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '100%' : 'minmax(0, 1fr) minmax(320px, 400px)', 
            gap: isMobile ? '32px' : '60px', 
            alignItems: 'start',
            paddingTop: isMobile ? '0' : '40px',
            width: '100%'
          }}>
            
            {/* Left Column: Tabs and Tab Content */}
            <div className="content-left">
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
                {['ITINÉRAIRE', 'EN DÉTAIL', 'HÉBERGEMENT', 'BUDGET', 'NOS CONSEILS'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    style={{
                      flex: isMobile ? '0 0 auto' : 1,
                      padding: isMobile ? '12px 15px' : '24px 10px',
                      fontSize: isMobile ? '10px' : '11px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      border: 'none',
                      borderRight: '1px solid #eee',
                      backgroundColor: activeTab === tab.toLowerCase() ? '#fff' : 'transparent',
                      color: activeTab === tab.toLowerCase() ? '#2e7d32' : '#333',
                      borderBottom: activeTab === tab.toLowerCase() ? '4px solid #2e7d32' : 'none',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content" style={{ padding: isMobile ? '32px 0' : '48px 0', borderTop: '1px solid #eee' }}>
              {activeTab === 'itinéraire' ? (
                <div className="itinerary-tab">
                  <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '24px' }}>
                    Le Canada aux couleurs de l'été indien...
                  </h2>
                  <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, marginBottom: '24px', textAlign: 'justify' }}>
                    L'été indien fait presque partie des emblèmes du Canada et les couleurs dont se pare la nature pendant ces quelques jours vous viennent immédiatement à l'esprit ! Pour cet autotour au Canada, nous avons fait la part belle à la nature québécoise ! Nombre de forêts et de lacs sont sur la route québécoise. À vous les grands espaces ! Comme vous vous en doutez, la palette de couleurs de ces quelques jours d'automne au Canada est tout simplement incroyable : du jaune au rouge intense, la nature revêt une autre dimension. Vous avez vu le Canada et l'été indien des centaines de fois... vivre ces quelques jours est une toute autre expérience. Avis aux amoureux de nature ! En plus de découvrir les couleurs quasi éblouissantes de l'été indien, vous découvrez au cours de votre autotour au Québec des villes, des parcs et des sites parmi les plus incontournables de la région !
                  </p>
                  <p style={{ fontSize: '15px', color: '#444', marginBottom: '24px' }}>
                    Région traversée au cours de ce voyage au Canada : <a href="#" style={{ color: '#1b4d3e', fontWeight: 600 }}>Montréal & le Québec</a>
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginBottom: '40px' }}>
                    N.B. : Ce voyage au Canada est un voyage individuel et sur mesure à personnaliser avec nos conseillers spécialistes de la destination.
                  </p>

                  <h3 style={{ fontSize: '20px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '24px' }}>
                    L'itinéraire
                  </h3>
                  
                  <div style={{ marginBottom: isMobile ? '32px' : '48px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: isMobile ? '300px' : '450px' }}>
                    <iframe
                      title="Itinéraire Québec & Montréal"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2836261.272111364!2d-74.88537624999999!3d46.4674393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a541c64b70d%3A0x3f10432365345d!2zUXXpYmVjLCBDYW5hZGE!5e0!3m2!1sfr!2smg!4v1714809500000!5m2!1sfr!2smg"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button style={{ backgroundColor: '#0a2e24', color: '#fff', padding: '14px 32px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer' }}>
                      Demander un devis
                    </button>
                  </div>
                </div>
              ) : activeTab === 'en détail' ? (
                <div className="detail-tab">
                  <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '32px' }}>
                    Votre voyage au Canada en détail :
                  </h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '150px 1fr', gap: isMobile ? '24px' : '40px' }}>
                    <div className="days-nav" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['JOUR 1', 'JOUR 2', 'JOUR 3', 'JOURS 4 ET 5', 'JOURS 6 ET 7', 'JOURS 8 ET 9', 'JOURS 10 ET 11', 'JOURS 12 ET 13', 'JOUR 14'].map((day, idx) => (
                        <a key={idx} href={`#day-${idx+1}`} style={{ fontSize: '12px', fontWeight: 700, color: '#333', textDecoration: 'none', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>{day}</a>
                      ))}
                    </div>

                    <div className="days-content">
                      <div id="day-1" style={{ marginBottom: '48px' }}>
                        <h4 style={{ color: '#2e7d32', fontSize: '16px', marginBottom: '16px' }}>Jour 1</h4>
                        <h3 style={{ fontSize: '18px', color: '#1b4d3e', marginBottom: '16px' }}>Montréal</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '16px', textAlign: 'justify' }}>
                          Votre voyage au Canada ou plus précisément votre autotour au Québec commence à Montréal ! Vous arrivez à l'aéroport de Montréal qui est assez proche du centre-ville. C'est à l'aéroport que vous prenez possession de votre voiture de location. Visiter Montréal, voilà le programme pour le reste de votre journée. En voiture, il est très simple de rejoindre le centre-ville et vous serez rapidement au cœur de la ville et de l'action. Montréal est une ville très accueillante... vous vous sentirez à la maison en un rien de temps !
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                          Nuit à Montréal. Petit déjeuner inclus. Déjeuner et dîner libres.
                        </p>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
                      </div>

                      <div id="day-2" style={{ marginBottom: '48px' }}>
                        <h4 style={{ color: '#2e7d32', fontSize: '16px', marginBottom: '16px' }}>Jour 2</h4>
                        <h3 style={{ fontSize: '18px', color: '#1b4d3e', marginBottom: '16px' }}>Montréal</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '16px', textAlign: 'justify' }}>
                          Au deuxième jour de votre voyage au Canada, vous profitez encore un peu des charmes et découvertes que Montréal a à vous offrir ! Pour vous dégourdir les jambes et apprécier pleinement la ville, pourquoi ne pas visiter Montréal à pied ou à vélo. Les possibilités de balades sont nombreuses et vous permettent de découvrir l'essentiel de la ville. Le Canal Lachine, le vieux Montréal, le Plateau... sont quelques uns des quartiers de la grande métropole qui vous attendent.
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                          Nuit à Montréal. Petit déjeuner inclus. Déjeuner et dîner libres.
                        </p>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
                      </div>

                      <div id="day-3" style={{ marginBottom: '48px' }}>
                        <h4 style={{ color: '#2e7d32', fontSize: '16px', marginBottom: '16px' }}>Jour 3</h4>
                        <h3 style={{ fontSize: '18px', color: '#1b4d3e', marginBottom: '16px' }}>Montréal - Mont Tremblant</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '16px', textAlign: 'justify' }}>
                          Votre voyage au Québec se poursuit avec la découverte du Mont Tremblant et de son magnifique parc national idéal pour admirer les couleurs de l'été indien. Lieu privilégié des canoteurs, le parc national du Mont Tremblant est le plus vaste et le plus ancien parc du réseau. Lacs, ruisseaux, rivières, le parc national du Mont Tremblant est un riche mélange de patrimoines naturels et historiques.
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                          Nuit à Mont Tremblant. Repas libres.
                        </p>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
                      </div>

                      <div id="day-4-5" style={{ marginBottom: '48px' }}>
                        <h4 style={{ color: '#2e7d32', fontSize: '16px', marginBottom: '16px' }}>Jours 4 et 5</h4>
                        <h3 style={{ fontSize: '18px', color: '#1b4d3e', marginBottom: '16px' }}>Mont Tremblant - Mauricie</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '16px', textAlign: 'justify' }}>
                          Direction la Mauricie, vaste territoire sauvage situé entre Montréal et Québec. C'est l'un des meilleurs endroits pour observer la faune canadienne et profiter des activités de plein air. Vous pourrez faire du canot, de la randonnée ou simplement vous détendre au bord d'un lac en admirant le reflet des érables rouges.
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                          Nuits en Mauricie. Repas libres.
                        </p>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
                      </div>

                      <div id="day-6-7" style={{ marginBottom: '48px' }}>
                        <h4 style={{ color: '#2e7d32', fontSize: '16px', marginBottom: '16px' }}>Jours 6 et 7</h4>
                        <h3 style={{ fontSize: '18px', color: '#1b4d3e', marginBottom: '16px' }}>Mauricie - Lac Delage</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '16px', textAlign: 'justify' }}>
                          Poursuivez votre route vers le Lac Delage. Ce petit coin de paradis est parfait pour une immersion totale dans la nature québécoise. Profitez du spa, faites du kayak sur le lac ou explorez les sentiers environnants.
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                          Nuits au Lac Delage. Petits déjeuners inclus.
                        </p>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />
                      </div>

                      <div id="day-8-14">
                        <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                          ... L'itinéraire se poursuit vers Tadoussac, Charlevoix et se termine à Québec avant votre retour vers Montréal pour votre vol de départ.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'hébergement' ? (
                <div className="accommodation-tab">
                  <h2 style={{
                    fontSize: '28px',
                    color: '#1b4d3e',
                    fontFamily: '"Playfair Display", serif',
                    marginBottom: '24px'
                  }}>
                    Vos hébergements pour votre voyage au Canada
                  </h2>
                  <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, marginBottom: '32px', textAlign: 'justify' }}>
                    La liste des hébergements proposés pour ce voyage comprend uniquement des hébergements testés, re-testés et approuvés par notre équipe locale selon des critères de qualité optimale. Elle reste cependant totalement personnalisable selon vos envies, vos critères de confort, votre budget et selon la disponibilité des hébergements au moment de votre réservation. N'hésitez pas à en faire part à votre conseiller(e) local(e).
                  </p>

                  <div className="accommodation-list" style={{ fontSize: isMobile ? '14px' : '15px', color: '#333', lineHeight: 1.8, overflowWrap: 'break-word' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Catégorie économique :</strong>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>Montréal : Hotel le Roberval (BB)</li>
                        <li>Mont Tremblant : Auberge le Voyageur</li>
                        <li>Mauricie : Auberge du Trappeur</li>
                        <li>Charlevoix – La Malbaie : Auberge les Sources (BB)</li>
                        <li>Parc National de la Jacques Cartier : Auberge du Jeune Voyageur (BB)</li>
                        <li>Québec – Lac Delage : Le Manoir du Lac Delage</li>
                        <li>Cantons de l'Est : Gite Au cœur de Magog (BB)</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Catégorie confort :</strong>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>Montréal : Hotel le Dauphin (BB)</li>
                        <li>Mont Tremblant : Gite la Tremblante (BB)</li>
                        <li>Mauricie – Saint Alexis des Monts : Pourvoirie du Lac Blanc</li>
                        <li>Charlevoix – La Malbaie : Auberge la Mansarde (BB)</li>
                        <li>Parc National de la Jacques Cartier : Parc National de la Jacques Cartier – Chalet</li>
                        <li>Québec – Ste Brigitte : Gite Aventures (BB)</li>
                        <li>Cantons de l'Est – Orford : Auberge de la Tour & Spa (BB)</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: '48px', textAlign: 'center' }}>
                    <button style={{
                      backgroundColor: '#0a2e24',
                      color: '#fff',
                      padding: '14px 32px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      Demander un devis
                    </button>
                  </div>
                </div>
              ) : activeTab === 'budget' ? (
                <div className="budget-tab">
                  <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '16px' }}>
                    Votre autotour au Canada à partir de 1980€ par personne
                  </h2>
                  <p style={{ fontSize: '15px', color: '#444', marginBottom: '32px' }}>
                    À partir de 1980 euros par personne avec hébergements en catégorie standard<br />
                    Ce tarif est établi sur la base de 2 participants. Le prix indiqué est par personne.<br />
                    Le tarif définitif peut varier en fonction du nombre de personnes, des dates de voyage, des prestations sélectionnées, des disponibilités et de la catégorie du véhicule.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '48px', marginBottom: '48px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '24px' }}>Inclus dans ce circuit</h3>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                          "13 nuits en chambre double standard dans les hébergements mentionnés dans la rubrique dans des hébergements de catégorie 3*",
                          "Les petits-déjeuners mentionnés (BB)",
                          "La location d'un véhicule de catégorie Compact prise au centre-ville de Montréal et remise à l'aéroport de Montréal pour une durée de 12 jours",
                          "Une assistance 7j/7",
                          "Les taxes d'hébergement canadiennes",
                          "Les frais de l'OPC : l'Office de la Protection du Consommateur"
                        ].map((item, i) => (
                          <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#444', alignItems: 'flex-start' }}>
                            <CheckCircle size={18} color="#2e7d32" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '24px' }}>Non inclus dans ce circuit</h3>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                          "Les vol internationaux et domestiques",
                          "Les repas non mentionnés",
                          "L'essence (la voiture doit être rendue avec le même niveau d'essence qu'à la prise), les assurances optionnelles (PAI, PEP, etc.) et la location d'accessoires (GPS, siège bébé, etc.)",
                          "Les dépenses personnelles, éventuels frais de parking, péages et entrées dans les parcs",
                          "Le péage du pont de la Confédération (environ 45$ aller-retour) à régler en quittant l'île",
                          "L'assurance de voyage optionnelle"
                        ].map((item, i) => (
                          <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#444', alignItems: 'flex-start' }}>
                            <span style={{ fontWeight: 800, color: '#666', flexShrink: 0, width: '18px', textAlign: 'center' }}>✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '20px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '16px' }}>
                    Réservez vos vols avec notre partenaire
                  </h3>
                  <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '24px', textAlign: 'justify' }}>
                    Notre statut d'agence de voyage locale ne nous permet malheureusement pas de réserver les vols internationaux à destination du Canada pour nos voyageurs.<br /><br />
                    Cependant, grâce à notre partenariat avec bynativ, nous vous offrons la possibilité de réserver vos billets d'avion en quelques clics via <a href="#" style={{ color: '#1b4d3e', fontWeight: 600, textDecoration: 'underline' }}>le moteur de réservation de vols</a> présent sur leur site.<br /><br />
                    En effectuant votre réservation via ce moteur, les émissions CO2 de votre vol sont entièrement absorbées. bynativ s'engage à compenser l'équivalent de votre empreinte carbone en contribuant à des projets de reforestation partout dans le monde !
                  </p>

                  <div style={{ textAlign: 'center' }}>
                    <button style={{ backgroundColor: '#0a2e24', color: '#fff', padding: '14px 32px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer' }}>
                      Demander un devis
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tips-tab">
                  <h2 style={{ fontSize: '24px', color: '#1b4d3e', fontFamily: '"Playfair Display", serif', marginBottom: '32px' }}>
                    Nos conseils d'amis pour ce voyage au Canada
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                    {[
                      "Au jour 5 de votre voyage au Canada, pourquoi ne pas faire la traversée de Baie Saint Paul à l'île aux Coudres ? Une fois sur place, louez des vélos afin de faire le tour de l'île ! De quoi vous dégourdir les jambes pendant 2 ou 3 heures.",
                      "Survoler la Mauricie en hydravion : une activité extraordinaire que vous pouvez vous offrir au cours du 4ème jour de votre voyage au Canada en automne... difficile de faire mieux pour admirer les couleurs de l'été indien !",
                      "Vous aimez le sirop d'érable ? Passez dire bonjour à Dany à la « Cabane à sucre de Dany » ! En plus de découvrir les secrets de fabrication du sirop d'érable, prenez le temps de déguster un repas typiquement canadien dans cette érablière des plus charmantes !"
                    ].map((tip, i) => (
                      <li key={i} style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, display: 'flex', gap: '12px', textAlign: 'justify' }}>
                        <span style={{ color: '#1b4d3e', fontWeight: 800 }}>–</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ textAlign: 'center' }}>
                    <button style={{ backgroundColor: '#0a2e24', color: '#fff', padding: '14px 32px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer' }}>
                      Demander un devis
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Right Column: Sidebar */}
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
                    {[
                      "La découverte et la visite des grandes villes du Québec : Montréal et Québec",
                      "Votre voyage au Canada vous permet de découvrir plusieurs parcs nationaux : Mont-Tremblant, Mauricie, Jacques-Cartier, Hautes Gorges... pour un voyage très nature !",
                      "Les couleurs de l'été indien : un must de votre autotour au Québec !"
                    ].map((point, index) => (
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
            </div>
          </div>
        </section>

      {/* ═══════════════ FORMULAIRE DEVIS & RÉSERVATION ═══════════════ */}
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
            }}>Contactez-nous</span>
            <h2 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontFamily: '"Playfair Display", serif',
              color: '#0a2e24',
              marginBottom: '16px',
              fontWeight: 700
            }}>Demande de devis & Réservation</h2>
            <p style={{ color: '#666', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              Complétez ce formulaire et notre équipe vous répondra dans les <strong>24h</strong> avec une offre personnalisée.
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
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #eee'
            }}>
              {[
                { val: 'devis', label: '📋 Demande de devis' },
                { val: 'reservation', label: '✈️ Réservation directe' }
              ].map(opt => (
                <button
                  key={opt.val}
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

            {/* Message succès */}
            {formStatus === 'success' && (
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
            )}

            {/* Formulaire */}
            {formStatus !== 'success' && (
              <form onSubmit={handleFormSubmit} style={{ padding: isMobile ? '32px 20px' : '48px' }}>

                {/* Erreur */}
                {formStatus === 'error' && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '14px 20px', marginBottom: '32px', color: '#b91c1c', fontSize: '14px', fontWeight: 600 }}>
                    ⚠️ Une erreur est survenue. Veuillez réessayer ou nous contacter directement à <a href="mailto:contact@explorile.mg" style={{ color: '#b91c1c' }}>contact@explorile.mg</a>
                  </div>
                )}

                {/* Grille champs */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

                  {/* Nom complet */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                      <User size={14} /> Nom complet <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input
                      type="text" name="nom" value={formData.nom} onChange={handleFormChange}
                      placeholder="Votre nom et prénom"
                      required
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#2e7d32'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                      <Mail size={14} /> Adresse email <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleFormChange}
                      placeholder="votre@email.com"
                      required
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#2e7d32'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                      <Phone size={14} /> Téléphone
                    </label>
                    <input
                      type="tel" name="telephone" value={formData.telephone} onChange={handleFormChange}
                      placeholder="+261 XX XX XXX XX"
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#2e7d32'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Nombre de participants */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                      <Users size={14} /> Nombre de participants
                    </label>
                    <select
                      name="participants" value={formData.participants} onChange={handleFormChange}
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', appearance: 'none', backgroundColor: '#fff', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer' }}
                    >
                      {['1', '2', '3', '4', '5', '6+'].map(n => <option key={n} value={n}>{n} {n === '1' ? 'personne' : 'personnes'}</option>)}
                    </select>
                  </div>

                  {/* Date de départ */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                      <Calendar size={14} /> Date de départ <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input
                      type="date" name="dateDepart" value={formData.dateDepart} onChange={handleFormChange}
                      required
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#2e7d32'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Durée */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                      <Clock size={14} /> Durée souhaitée
                    </label>
                    <select
                      name="duree" value={formData.duree} onChange={handleFormChange}
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', appearance: 'none', backgroundColor: '#fff', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer' }}
                    >
                      <option value="">Selon l'itinéraire (14 j)</option>
                      <option value="7">7 jours</option>
                      <option value="10">10 jours</option>
                      <option value="14">14 jours (recommandé)</option>
                      <option value="21">21 jours</option>
                      <option value="Sur mesure">Sur mesure</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#333', marginBottom: '8px' }}>
                    <MessageSquare size={14} /> Message ou demande particulière
                  </label>
                  <textarea
                    name="message" value={formData.message} onChange={handleFormChange}
                    placeholder="Partagez vos envies, contraintes ou questions spécifiques (allergies, mobilité réduite, anniversaire, voyage de noces…)"
                    rows={4}
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = '#2e7d32'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* Infos circuit sélectionné */}
                <div style={{ backgroundColor: '#f0faf1', border: '1px solid #c6e6c8', borderRadius: '10px', padding: '16px 20px', marginBottom: '32px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2e7d32', fontWeight: 600 }}>
                    <MapPin size={15} /> Circuit : L'été indien – Canada
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2e7d32', fontWeight: 600 }}>
                    <Clock size={15} /> 14 jours / 13 nuits
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2e7d32', fontWeight: 600 }}>
                    <Tag size={15} /> À partir de 1 980€ / pers.
                  </div>
                </div>

                {/* Bouton */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0, maxWidth: '360px', lineHeight: 1.5 }}>
                    <span style={{ color: '#e53e3e' }}>*</span> Champs obligatoires. Vos données sont traitées conformément à notre politique de confidentialité.
                  </p>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      backgroundColor: formStatus === 'submitting' ? '#555' : '#0a2e24',
                      color: '#fff',
                      padding: '15px 36px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      border: 'none',
                      cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseOver={e => { if (formStatus !== 'submitting') e.currentTarget.style.backgroundColor = '#154a3a'; }}
                    onMouseOut={e => { if (formStatus !== 'submitting') e.currentTarget.style.backgroundColor = '#0a2e24'; }}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Envoi en cours…
                      </>
                    ) : (
                      <><Send size={16} /> {formData.typeVoyage === 'devis' ? 'Demander mon devis' : 'Confirmer ma réservation'}</>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="sticky-cta-bar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        padding: '16px 0',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        transform: showStickyBar ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: isMobile ? 'nowrap' : 'wrap', 
          gap: '12px',
          width: '100%'
        }}>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0a422a' }}>1980€/pers</div>
              <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>14 jours / 13 nuits</div>
            </div>
          ) : (
            <div className="cta-left" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0a422a', margin: 0, fontFamily: '"Playfair Display", serif' }}>
                L'été indien : autotour au Canada en aut...
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0a422a', fontSize: '15px' }}>
                  <Tag size={18} />
                  <span>À partir de <strong>1980€/pers</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0a422a', fontSize: '15px' }}>
                  <Clock size={18} />
                  <span>Durée <strong>14 jours / 13 nuits</strong></span>
                </div>
              </div>
            </div>
          )}
          
            <button style={{
              backgroundColor: '#0a2e24',
              color: '#fff',
              padding: isMobile ? '10px 16px' : '14px 32px',
              borderRadius: '4px',
              fontSize: isMobile ? '11px' : '14px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#154a3a'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0a2e24'}
            >
              Devis
            </button>
        </div>
      </div>

      {/* Custom Dialog Modal */}
      {dialog.show && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 2000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '100%', maxWidth: '400px',
            borderRadius: '24px', padding: '32px', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '18px',
              backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444'
            }}>
              <Info size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B5E20', marginBottom: '12px' }}>
              Information
            </h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              {dialog.message}
            </p>
            <button
              onClick={() => setDialog({ ...dialog, show: false })}
              style={{
                width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
                backgroundColor: '#1B5E20', color: '#fff', fontWeight: 700,
                fontSize: '14px', cursor: 'pointer'
              }}
            >D'accord</button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Details;
