import React, { useState, useEffect, useRef } from 'react';

const StarRating = ({ rating = 5 }) => (
  <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#D4A017' : '#ccc', fontSize: '22px' }}>★</span>
    ))}
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}. ${month}. ${year}`;
  } catch {
    return dateStr;
  }
};

const TestimonialCard = ({ testimonial, isVisible }) => {
  const [hovered, setHovered] = useState(false);

  const name = testimonial?.name || 'Anonyme';
  const date = formatDate(testimonial?.created_at || testimonial?.date);
  const rating = testimonial?.rating || 5;
  const text = testimonial?.content || testimonial?.quote || '';
  const avatar = testimonial?.image_url || testimonial?.image || '/image/placeholder.png';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#f0f0f0',
        borderRadius: '16px',
        padding: '32px 28px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '320px',
        boxShadow: hovered
          ? '0 12px 36px rgba(0,0,0,0.14)'
          : '0 2px 10px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
        opacity: isVisible ? 1 : 0,
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* Quote mark */}
      <div style={{ marginBottom: '12px' }}>
        <span style={{
          fontSize: '72px',
          lineHeight: 0.8,
          color: '#1a1a1a',
          fontFamily: 'Georgia, serif',
          fontWeight: 900,
          display: 'block',
          userSelect: 'none'
        }}>"</span>
      </div>

      {/* Quote text */}
      <p style={{
        fontSize: '15px',
        lineHeight: 1.7,
        color: '#333',
        margin: '0 0 28px 0',
        flex: 1
      }}>
        {text}
      </p>

      {/* Avatar + Name + Date + Stars */}
      <div>
        <img
          src={avatar}
          alt={name}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '12px',
            border: '3px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
          }}
        />
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#111',
          textTransform: 'uppercase',
          letterSpacing: '0.8px'
        }}>
          {name}
        </div>
        {date && (
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#333', marginTop: '4px' }}>
            {date}
          </div>
        )}
        <StarRating rating={rating} />
      </div>
    </div>
  );
};

const TestimonialSlider = ({ testimonials, isMobile }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const perPage = isMobile ? 1 : 3;
  const totalItems = testimonials.length;
  const timerRef = useRef(null);

  useEffect(() => {
    if (totalItems <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % totalItems);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [totalItems]);

  if (!testimonials || testimonials.length === 0) return null;

  // Build the list of visible testimonials by wrapping around the index
  const visible = [];
  for (let i = 0; i < perPage; i++) {
    const idx = (activeIndex + i) % totalItems;
    // Handle case where we have fewer testimonials than perPage to avoid duplicate rendering
    if (i > 0 && idx === activeIndex) break;
    visible.push({
      item: testimonials[idx],
      originalIndex: idx
    });
  }

  return (
    <section style={{
      backgroundColor: '#fff',
      padding: isMobile ? '60px 20px 80px' : '80px 40px 100px',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#D4A017',
            marginBottom: '12px'
          }}>
            Avis Voyageurs
          </p>
          <h2 style={{
            fontSize: isMobile ? '2rem' : '2.8rem',
            fontWeight: 800,
            color: '#1a1a1a',
            margin: '0 0 16px',
            fontFamily: '"Outfit", sans-serif'
          }}>
            Ce que disent nos voyageurs
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Leurs sourires et leurs souvenirs sont notre plus belle récompense.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : `repeat(${visible.length}, 1fr)`,
          gap: '24px',
          marginBottom: '48px'
        }}>
          {visible.map(({ item, originalIndex }, i) => (
            <TestimonialCard 
              key={`${activeIndex}-${originalIndex}-${i}`} 
              testimonial={item} 
              isVisible={true} 
            />
          ))}
        </div>

        {/* Dot pagination */}
        {totalItems > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); clearInterval(timerRef.current); }}
                style={{
                  width: i === activeIndex ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: i === activeIndex ? '#D4A017' : '#ccc',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSlider;
