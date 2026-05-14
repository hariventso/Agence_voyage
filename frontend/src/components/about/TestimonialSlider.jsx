import React from 'react';

const TestimonialSlider = ({ testimonials, activeReview, setActiveReview, isMobile }) => {
  if (testimonials.length === 0) return null;

  return (
    <section style={{
      backgroundColor: '#000',
      padding: isMobile ? '60px 0 100px' : '80px 0 120px',
      textAlign: 'center'
    }}>
      <div className="container">
        <div style={{ marginBottom: '48px' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '1.2rem',
            marginBottom: '12px'
          }}>Read The Top</p>
          <h2 style={{
            fontSize: isMobile ? '2.5rem' : '3.5rem',
            fontFamily: "'Playfair Display', serif",
            color: '#FF8C00',
            fontWeight: 600
          }}>Avis Voyageurs</h2>
          <p style={{
            color: '#888',
            fontSize: '0.9rem',
            maxWidth: '800px',
            margin: '24px auto 0',
            lineHeight: 1.6
          }}>
            Ce que disent nos voyageurs. Leurs sourires et leurs souvenirs sont notre plus belle récompense. Découvrez leurs retours d'expérience sur nos différents circuits à travers l'île.
          </p>
        </div>

        {/* Testimonial Card */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: isMobile ? '30px 20px' : '40px',
          textAlign: 'left',
          position: 'relative',
          color: '#000',
          transition: 'all 0.5s ease-in-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <img
              src={testimonials[activeReview]?.image_url || testimonials[activeReview]?.image || '/image/placeholder.png'}
              alt={testimonials[activeReview]?.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{testimonials[activeReview]?.name}</h4>
              <div style={{ fontSize: '0.85rem', color: '#1B5E20', fontWeight: 600 }}>{testimonials[activeReview]?.role}</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {Array.from({ length: testimonials[activeReview]?.rating || 5 }).map((_, s) => (
                  <span key={s} style={{ color: '#FF8C00' }}>★</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              margin: 0
            }}>
              "{testimonials[activeReview]?.content || testimonials[activeReview]?.quote}"
            </p>
          </div>
        </div>

        {/* Pagination dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
          {testimonials.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setActiveReview(i)}
              style={{
                width: '10px', height: '10px',
                borderRadius: '50%',
                backgroundColor: i === activeReview ? '#FF8C00' : '#444',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
