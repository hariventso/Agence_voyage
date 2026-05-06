import React, { useState, useEffect } from 'react';
import { MapPin, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

function Destination() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState('0.8s');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Gallery Slider State
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryTransition, setGalleryTransition] = useState('0.6s');
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    destination: '---',
    date: '',
    guests: '1 Person'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const originalGalleryCards = [
    { id: 1, subtitle: 'Romantic', title: 'Wine Tour', image: '/image/hero.png' },
    { id: 2, subtitle: 'Relaxing', title: 'Holiday', image: '/image/maldives.png' },
    { id: 3, subtitle: 'Stunning', title: 'Far Places', image: '/image/mountain.png' },
    { id: 4, subtitle: 'Adventurous', title: 'Safari', image: '/image/hero_new.png' },
    { id: 5, subtitle: 'Peaceful', title: 'Beach', image: '/image/maldives.png' },
  ];
  // Clone cards for infinite effect (showing 3 at a time)
  const galleryCards = [...originalGalleryCards, originalGalleryCards[0], originalGalleryCards[1], originalGalleryCards[2]];

  const nextGallery = () => {
    setGalleryTransition('0.6s');
    setGalleryIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (galleryIndex === originalGalleryCards.length) {
      const timer = setTimeout(() => {
        setGalleryTransition('0s');
        setGalleryIndex(0);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [galleryIndex, originalGalleryCards.length]);

  const prevGallery = () => {
    if (galleryIndex === 0) {
      setGalleryTransition('0s');
      setGalleryIndex(originalGalleryCards.length);
      setTimeout(() => {
        setGalleryTransition('0.6s');
        setGalleryIndex(originalGalleryCards.length - 1);
      }, 50);
    } else {
      setGalleryTransition('0.6s');
      setGalleryIndex((prev) => prev - 1);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookNow = () => {
    if (bookingData.destination === '---' || !bookingData.date) {
      alert('Veuillez sélectionner une destination et une date.');
      return;
    }
    
    // Simulate booking/search action
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto-redirect after a delay
      setTimeout(() => {
        window.location.hash = '#contact';
      }, 3000);
    }, 1500);
  };

  
  const originalImages = [
    '/image/hero_new.png',
    '/image/mountain.png',
    '/image/hero.png',
    '/image/maldives.png'
  ];
  // Clone the first image at the end to create a seamless infinite loop
  const slideImages = [...originalImages, originalImages[0]];

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitionDuration('0.8s');
      setCurrentSlide((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // When we reach the cloned first slide, wait for the animation to finish, 
    // then instantly snap back to the actual first slide without animation.
    if (currentSlide === originalImages.length) {
      const resetTimer = setTimeout(() => {
        setTransitionDuration('0s');
        setCurrentSlide(0);
      }, 800); // 800ms matches the CSS transition duration
      return () => clearTimeout(resetTimer);
    }
  }, [currentSlide, originalImages.length]);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingTop: '0' }}>
      
      {/* Hero Destination */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? '40vh' : '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        overflow: 'hidden',
        paddingTop: isMobile ? '120px' : '120px' // Increased for navbar space
      }}>
        {/* Background Image - reusing mountain.png */}
        <img 
          src="/image/mountain.png" 
          alt="Destination Background" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }} 
        />
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1
        }}></div>
 
        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: isMobile ? '0 16px' : '0 20px' }}>
          <h1 className="page-hero-h1" style={{
            color: '#FF8C00',
            fontWeight: 700,
            marginBottom: isMobile ? '20px' : '24px',
            marginTop: isMobile ? '20px' : '0',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: isMobile ? '2.5rem' : '4.5rem'
          }}>
            Destination
          </h1>
          <p style={{
            color: '#FFFFFF',
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            lineHeight: 1.6,
            maxWidth: '800px',
            margin: '0 auto',
            fontWeight: 400,
            textAlign: 'justify'
          }}>
            Explorez les merveilles de Madagascar à travers des circuits conçus à partir de recherches scientifiques et de savoirs locaux. Une immersion véritable au cœur de l’âme malgache.
          </p>
        </div>
      </section>

      {/* Search Holiday Section */}
      <section style={{
        backgroundColor: '#000000',
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="container" style={{ width: '100%', maxWidth: '1000px' }}>
          <h3 className="page-section-h3" style={{
            color: '#FFFFFF',
            fontFamily: "'Playfair Display', serif, cursive", 
            fontStyle: 'italic',
            marginBottom: '8px',
            fontWeight: 400
          }}>
            Promotion
          </h3>
          <h2 className="page-section-h2" style={{
            color: '#FF8C00',
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-1px',
            marginBottom: '40px'
          }}>
            Search your Holiday
          </h2>

          {/* Card containing image and search form */}
          <div style={{
            margin: '0 auto',
            backgroundColor: '#8b9a9d',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            textAlign: 'left',
            position: 'relative'
          }}>
            {/* Top image part */}
            <div style={{ width: '100%', height: isMobile ? '250px' : '400px', position: 'relative' }}>
               <img src="/image/hero.png" alt="Landscape" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            {/* Bottom search form part */}
            <div style={{
               padding: isMobile ? '24px 20px' : '24px 32px',
               display: 'flex',
               flexDirection: isMobile ? 'column' : 'row',
               gap: isMobile ? '20px' : '24px',
               alignItems: isMobile ? 'stretch' : 'flex-end',
               justifyContent: 'space-between',
               flexWrap: 'wrap'
            }}>
              {/* Field 1 */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Select Your Destination :</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    name="destination"
                    value={bookingData.destination}
                    onChange={handleBookingChange}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', appearance: 'none', backgroundColor: '#fff', color: '#666', fontSize: '14px', outline: 'none', fontWeight: 500 }}
                  >
                    <option>---</option>
                    <option>Madagascar</option>
                    <option>Sainte Marie</option>
                    <option>Nosy Be</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              {/* Field 2 */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Select Your Date :</label>
                <div>
                  <input 
                    type="date" 
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      backgroundColor: '#fff', 
                      color: '#666', 
                      fontSize: '14px', 
                      outline: 'none', 
                      fontWeight: 500,
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }} 
                  />
                </div>
              </div>

              {/* Field 3 */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Total Guest :</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleBookingChange}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: 'none', appearance: 'none', backgroundColor: '#fff', color: '#666', fontSize: '14px', outline: 'none', fontWeight: 500 }}
                  >
                    <option>1 Person</option>
                    <option>2 Persons</option>
                    <option>3 Persons</option>
                    <option>4+ Persons</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

                <button 
                  onClick={handleBookNow}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? '#444' : '#2c3333', 
                    color: '#fff',
                    border: '1px solid #fff',
                    padding: '14px 32px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}
                >
                  {isSubmitting ? 'Searching...' : 'Book Now'}
                </button>
              </div>

            {/* Success Overlay/Message */}
            {showSuccess && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
                zIndex: 10,
                backdropFilter: 'blur(5px)',
                transition: 'all 0.5s ease'
              }}>
                <div style={{ 
                  backgroundColor: '#FF8C00', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Check size={32} color="#fff" />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '10px' }}>Recherche en cours !</h3>
                <p style={{ color: '#ccc', maxWidth: '400px', lineHeight: 1.6 }}>
                  Nous préparons les meilleures offres pour <strong>{bookingData.destination}</strong>.<br/>
                  Redirection vers la page contact...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Packages Section */}
      <section style={{
        backgroundColor: '#000000',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h3 className="page-section-h3" style={{
            color: '#FFFFFF',
            fontFamily: "'Playfair Display', serif, cursive", 
            fontStyle: 'italic',
            marginBottom: '8px',
            fontWeight: 400
          }}>
            Promotion
          </h3>
          <h2 className="page-section-h2" style={{
            color: '#FF8C00',
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-1px',
            marginBottom: '40px'
          }}>
            Our Packages
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            textAlign: 'left'
          }}>
            {/* Card 1 */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '240px' }}>
                <img src="/image/mountain.png" alt="Europe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FF8C00', color: '#fff', padding: '12px 24px', fontWeight: 600, fontSize: '18px' }}>
                  Antananarivo
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', fontWeight: 700, fontSize: '18px' }}>
                    <MapPin fill="#000" color="#fff" size={20} />
                    Excursions d'une journée
                  </div>
                  <div style={{ color: '#000', fontWeight: 600, fontSize: '16px' }}>
                    $700
                  </div>
                </div>
                <p style={{ color: '#444', fontSize: '14px', lineHeight: 1.6, margin: 0, textAlign: 'justify' }}>
                  Découvrez Madagascar au-delà des sentiers battus pour une immersion au cœur de l’âme malgache.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '240px' }}>
                <img src="/image/hero_new.png" alt="Thailand" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FF8C00', color: '#fff', padding: '12px 24px', fontWeight: 600, fontSize: '18px' }}>
                  Sud Madagascar
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', fontWeight: 700, fontSize: '18px' }}>
                    <MapPin fill="#000" color="#fff" size={20} />
                    Circuits Culturels
                  </div>
                  <div style={{ color: '#000', fontWeight: 600, fontSize: '16px' }}>
                    $1200
                  </div>
                </div>
                <p style={{ color: '#444', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Découvrez Madagascar au-delà des sentiers battus pour une immersion au cœur de l’âme malgache.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '240px' }}>
                <img src="/image/hero.png" alt="Africa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FF8C00', color: '#fff', padding: '12px 24px', fontWeight: 600, fontSize: '18px' }}>
                  Est Madagascar
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', fontWeight: 700, fontSize: '18px' }}>
                    <MapPin fill="#000" color="#fff" size={20} />
                    Séjours Balnéaires
                  </div>
                  <div style={{ color: '#000', fontWeight: 600, fontSize: '16px' }}>
                    $900
                  </div>
                </div>
                <p style={{ color: '#444', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Découvrez Madagascar au-delà des sentiers battus pour une immersion au cœur de l’âme malgache.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Popular Tours Section */}
      <section style={{
        backgroundColor: '#000000',
        padding: '80px 20px',
        color: '#fff'
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 className="page-hero-h2" style={{
            color: '#FF8C00',
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-1px',
            marginBottom: '16px',
            textAlign: 'left'
          }}>
            Our Popular Tours
          </h2>
          <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: '40px', maxWidth: '800px', textAlign: 'justify' }}>
            Chaque circuit est soigneusement élaboré par des professionnels passionnés pour allier découvertes culturelles et moments de détente.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '40px' : '60px',
            alignItems: isMobile ? 'stretch' : 'center',
            flexWrap: 'wrap'
          }}>
            {/* Left side: Image Slider */}
            <div style={{ flex: isMobile ? '1 1 auto' : '1 1 400px', position: 'relative', height: isMobile ? '300px' : '400px', borderRadius: '16px', overflow: 'hidden' }}>
              
              {/* Slider Track */}
              <div style={{ 
                display: 'flex', 
                width: '100%', 
                height: '100%', 
                transform: `translateX(-${currentSlide * 100}%)`, 
                transition: `transform ${transitionDuration} ease-in-out` 
              }}>
                {slideImages.map((src, index) => (
                  <img 
                    key={index}
                    src={src} 
                    alt={`Tour Slide ${index + 1}`} 
                    style={{ 
                      flexShrink: 0,
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }} 
                  />
                ))}
              </div>
              
              {/* Optional: Slider Dots */}
              <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
                {originalImages.map((_, index) => {
                  const isActive = currentSlide === index || (currentSlide === originalImages.length && index === 0);
                  return (
                    <div 
                      key={index} 
                      onClick={() => {
                        setTransitionDuration('0.8s');
                        setCurrentSlide(index);
                      }}
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: isActive ? '#FF8C00' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                      }} 
                    />
                  );
                })}
              </div>
            </div>

            {/* Right side: Tour List */}
            <div style={{ flex: isMobile ? '1 1 auto' : '1 1 500px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Item 1 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Nosy Be</h4>
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Plage | Hôtel | Détente</span>
                  </div>
                  <div style={{ flexGrow: 1, borderBottom: '1px dashed #444', margin: '0 16px 6px 16px' }}></div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF8C00' }}>599€</div>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, textAlign: 'justify' }}>
                  Découvrez l'île aux parfums, ses plages de sable blanc et ses eaux turquoise.
                </p>
              </div>

              {/* Item 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Sainte Marie</h4>
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Nature | Baleines | Histoire</span>
                  </div>
                  <div style={{ flexGrow: 1, borderBottom: '1px dashed #444', margin: '0 16px 6px 16px' }}></div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF8C00' }}>800€</div>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, textAlign: 'justify' }}>
                  Une escale authentique entre pirates, baleines à bosse et nature préservée.
                </p>
              </div>

              {/* Item 3 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Antsirabe</h4>
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Culture | Artisanat | Histoire</span>
                  </div>
                  <div style={{ flexGrow: 1, borderBottom: '1px dashed #444', margin: '0 16px 6px 16px' }}></div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF8C00' }}>650€</div>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, textAlign: 'justify' }}>
                  La ville d'eau et ses célèbres pousse-pousse au cœur des traditions malgaches.
                </p>
              </div>

              {/* Item 4 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Ifaty</h4>
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Sud | Lagon | Baobabs</span>
                  </div>
                  <div style={{ flexGrow: 1, borderBottom: '1px dashed #444', margin: '0 16px 6px 16px' }}></div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF8C00' }}>700€</div>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, textAlign: 'justify' }}>
                  Détente au bord du lagon et exploration de la forêt de baobabs épineux.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section style={{
        backgroundColor: '#000000',
        padding: '80px 20px',
        color: '#fff',
        borderTop: '1px solid #111'
      }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h3 className="page-section-h3" style={{
              color: '#FFFFFF',
              fontFamily: "'Playfair Display', serif, cursive", 
              fontStyle: 'italic',
              marginBottom: '8px',
              fontWeight: 400
            }}>
              Amazing Experience
            </h3>
            <h2 className="page-section-h2" style={{
              color: '#FF8C00',
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-1px',
              margin: 0
            }}>
              Our Services
            </h2>
          </div>

          {/* Top Row: 3 Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '40px',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Travel by bus, car and minivan</h4>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Air conditioning guaranteed</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Entrance to the museums</h4>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>50% discount on all admissions</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Travel with children and pets</h4>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Possibility to rent the stroller</p>
            </div>
          </div>

          {/* Divider Line */}
          <div style={{ borderBottom: '1px solid #222', margin: '40px 0' }}></div>

          {/* Bottom Row: 2 Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? '30px' : '40px',
            textAlign: 'left'
          }}>
            {/* Left Col: Package specifications */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Package specifications</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '15px' }}>
                  <Check size={18} color="#10B981" strokeWidth={3} />
                  Travel cancellation insurance
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '15px' }}>
                  <Check size={18} color="#10B981" strokeWidth={3} />
                  Breakfast and dinner included
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '15px' }}>
                  <Check size={18} color="#10B981" strokeWidth={3} />
                  Health care included
                </li>
              </ul>
            </div>

            {/* Right Col: Services NOT included */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Services NOT included</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '15px' }}>
                  <X size={18} color="#EF4444" strokeWidth={3} />
                  Lunch not included in the package
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '15px' }}>
                  <X size={18} color="#EF4444" strokeWidth={3} />
                  Baggage protection insurance
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Manual Gallery Slider Section */}
      <section style={{
        backgroundColor: '#000000',
        padding: '60px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            display: 'flex',
            transition: `transform ${galleryTransition} ease-in-out`,
            transform: `translateX(-${isMobile ? (galleryIndex * 100) : (galleryIndex * 100) / 3}%)`,
            width: '100%'
          }}>
            {galleryCards.map((card, idx) => (
              <div key={`${card.id}-${idx}`} style={{
                flex: isMobile ? '0 0 100%' : '0 0 33.3333%',
                padding: '0 10px',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  position: 'relative',
                  height: '500px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  <img src={card.image} alt={card.title} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} />
                  {/* Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif, cursive",
                      fontStyle: 'italic',
                      fontSize: isMobile ? '1.4rem' : '1.8rem',
                      color: '#fff',
                      marginBottom: '8px'
                    }}>{card.subtitle}</span>
                    <h3 style={{
                      fontSize: isMobile ? '1.8rem' : '2.2rem',
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0
                    }}>{card.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Small Square Style) inside container */}
          <button 
            onClick={prevGallery}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.4)',
              border: 'none',
              color: '#fff',
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}>
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
          <button 
            onClick={nextGallery}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.4)',
              border: 'none',
              color: '#fff',
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}>
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
      </section>

    </div>
  );
}

export default Destination;
