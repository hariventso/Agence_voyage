import React, { useState, useEffect } from 'react';
import { MapPin, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

function Destination() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState('0.8s');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchDestinations();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/destinations');
      const data = await res.json();
      setDestinations(data.filter(d => d.status === 'Actif'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  
  const [bookingData, setBookingData] = useState({ destination: '---', date: '', guests: '1 Person' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingTop: '0' }}>
      
      {/* Hero */}
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
        <img src="/image/mountain.png" alt="Hero" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
          <h1 style={{ color: '#FF8C00', fontWeight: 700, marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: isMobile ? '3rem' : '5rem' }}>
            Destination
          </h1>
          <p style={{ color: '#FFFFFF', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto', fontWeight: 400 }}>
            Explorez les merveilles de Madagascar à travers nos circuits authentiques.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: '#000', padding: '80px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 style={{ color: '#FF8C00', marginBottom: '40px' }}>Nos Offres</h2>
          {loading ? <p>Chargement...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', textAlign: 'left' }}>
              {destinations.map(dest => (
                <div key={dest.id} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '220px' }}>
                    <img src={dest.image_url || '/image/mountain.png'} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FF8C00', color: '#fff', padding: '10px 20px', fontWeight: 600 }}>{dest.name}</div>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#000' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}><MapPin size={18} /> {dest.type}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{dest.price}</div>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{dest.description || 'Description à venir...'}</p>
                    <a href="#detail" style={{ backgroundColor: '#0a2e24', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>Voir le circuit →</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ backgroundColor: '#000', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #111' }}>
          <p>© 2024 Explor'île Madagascar - Tous droits réservés</p>
      </section>
    </div>
  );
}

export default Destination;
