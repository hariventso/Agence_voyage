import React from 'react';

const TeamExpertGrid = ({ teamMembers, isMobile }) => {
  return (
    <section style={{
      backgroundColor: '#000',
      padding: isMobile ? '60px 0 80px' : '80px 0 120px',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#fff',
            fontSize: isMobile ? '1rem' : '1.2rem',
            marginBottom: '8px',
            fontWeight: 400,
          }}>
            Notre meilleure
          </p>
          <h2 style={{
            fontSize: isMobile ? '2.2rem' : '3.5rem',
            fontFamily: "'Playfair Display', serif",
            color: '#FF8C00',
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            Équipe d'Experts
          </h2>
        </div>

        {/* Team Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px' : '24px',
        }}>
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamMemberCard = ({ member, isMobile }) => (
  <div
    style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default',
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,140,0,0.15)';
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    {/* Photo */}
    <div style={{
      width: '100%',
      aspectRatio: '3/4',
      overflow: 'hidden',
      backgroundColor: '#333',
    }}>
      <img
        src={member.image_url || member.image || '/image/placeholder.png'}
        alt={member.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          display: 'block',
        }}
      />
    </div>

    {/* Info */}
    <div style={{
      padding: isMobile ? '16px 12px' : '20px',
      backgroundColor: '#2a2a2a',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <h3 style={{
        fontSize: isMobile ? '0.95rem' : '1.1rem',
        fontFamily: "'Playfair Display', serif",
        color: '#fff',
        fontWeight: 600,
        textAlign: 'center',
        margin: 0,
      }}>
        {member.name}
      </h3>
      <p style={{
        color: '#FF8C00',
        fontSize: isMobile ? '0.7rem' : '0.78rem',
        fontWeight: 700,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        margin: 0,
      }}>
        {member.role}
      </p>
      {!isMobile && (
        <p style={{
          color: '#aaa',
          fontSize: '0.82rem',
          lineHeight: 1.55,
          textAlign: 'center',
          margin: 0,
        }}>
          {member.bio}
        </p>
      )}

      {/* Social Icons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '12px',
      }}>
        {member.facebook_url && <SocialIcon href={member.facebook_url} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>} />}
        {member.twitter_url && <SocialIcon href={member.twitter_url} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>} />}
        {member.instagram_url && <SocialIcon href={member.instagram_url} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>} />}
        {member.pinterest_url && <SocialIcon href={member.pinterest_url} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>} />}
      </div>
    </div>
  </div>
);

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    style={{ color: '#888', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
    onMouseOver={e => e.currentTarget.style.color = '#FF8C00'}
    onMouseOut={e => e.currentTarget.style.color = '#888'}
  >
    {icon}
  </a>
);

export default TeamExpertGrid;
