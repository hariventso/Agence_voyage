import React, { useState, useEffect } from 'react';
import DetailsHero from '../components/details/DetailsHero';
import FloatingInfoCard from '../components/details/FloatingInfoCard';
import DetailsTabs from '../components/details/DetailsTabs';
import DetailsSidebar from '../components/details/DetailsSidebar';
import BookingForm from '../components/details/BookingForm';
import DestinationGrid from '../components/destinations/DestinationGrid';

const Details = ({ destinationId }) => {
  const [destination, setDestination] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeTab, setActiveTab] = useState('itineraire');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
        const [destRes, allRes] = await Promise.all([
          fetch(`http://localhost:5000/api/destinations/${destinationId}`),
          fetch(`http://localhost:5000/api/destinations`)
        ]);

        if (!destRes.ok) throw new Error('Destination non trouvée');
        const destData = await destRes.json();
        setDestination(destData);

        if (allRes.ok) {
          const allData = await allRes.json();
          // Exclure la destination actuelle de la liste suggérée
          setDestinations(allData.filter(d => d.id !== parseInt(destinationId)));
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destinationId]);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.email || !formData.dateDepart) {
      setDialog({ show: true, message: 'Veuillez remplir les champs obligatoires : Nom, Email et Date de départ.' });
      return;
    }
    
    const whatsappNumber = '261340000000'; // Numéro à adapter
    const text = `Bonjour, je souhaite réserver le circuit : ${destination.name}. %0A%0A` +
                 `Détails : %0A` +
                 `- Nom : ${formData.nom} %0A` +
                 `- Email : ${formData.email} %0A` +
                 `- Téléphone : ${formData.telephone} %0A` +
                 `- Participants : ${formData.participants} %0A` +
                 `- Date de départ : ${formData.dateDepart} %0A` +
                 `- Type : ${formData.typeVoyage} %0A` +
                 `- Message : ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(whatsappUrl, '_blank');
    
    setFormStatus('success');
    setFormData({ nom: '', email: '', telephone: '', participants: '2', dateDepart: '', duree: '', typeVoyage: 'devis', message: '' });
  };

  if (loading) return null;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', backgroundColor: '#000', color: '#ff4d4d', height: '100vh' }}>Erreur: {error}</div>;
  if (!destination) return <div style={{ padding: '100px', textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh' }}>Destination non trouvée</div>;

  return (
    <div className="details-page" style={{ overflowX: 'hidden' }}>
      <DetailsHero isMobile={isMobile} destination={destination} />

      <section className="main-content-section" style={{ backgroundColor: '#fff', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>

          <FloatingInfoCard isMobile={isMobile} destination={destination} />

          <div className="details-body-grid" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '100%' : 'minmax(0, 1fr) minmax(320px, 400px)',
            gap: isMobile ? '32px' : '60px',
            alignItems: 'start',
            paddingTop: isMobile ? '0' : '40px',
            width: '100%'
          }}>
            <DetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} destination={destination} />
            <DetailsSidebar isMobile={isMobile} destination={destination} />
          </div>
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
              <span style={{ fontSize: '10px', color: '#999', display: 'block' }}>À partir de</span>
              <span style={{ fontSize: '16px', fontWeight: 800 }}>{destination.price}</span>
            </div>
            <button
              onClick={() => document.getElementById('formulaire-devis')?.scrollIntoView({ behavior: 'smooth' })}
              style={stickyButtonStyle}
            >
              Devis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '400px', textAlign: 'center' };
const buttonStyle = { backgroundColor: '#0a2e24', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '16px' };
const stickyBarStyle = { position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#fff', padding: '12px 20px', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', zIndex: 1000, borderTop: '1px solid #eee' };
const stickyButtonStyle = { backgroundColor: '#0a2e24', color: '#fff', padding: '10px 20px', borderRadius: '4px', border: 'none', fontWeight: 800, fontSize: '12px' };

export default Details;
