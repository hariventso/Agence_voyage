import React, { useState, useEffect } from 'react';

function Blog() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchPosts();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error("Error fetching posts:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingTop: '0' }}>
      
      {/* Hero Blog */}
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
        <img 
          src="/image/mountain.png" 
          alt="Blog Background" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
          <h1 style={{ color: '#FF8C00', fontWeight: 700, marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: isMobile ? '3rem' : '5rem' }}>
            Blog
          </h1>
          <p style={{ color: '#FFFFFF', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto', fontWeight: 400 }}>
            Découvrez Madagascar à travers des récits authentiques, pour une immersion au cœur de l’âme malgache.
          </p>
        </div>
      </section>

      {/* Blog Feed Section */}
      <section style={{ backgroundColor: '#000000', padding: isMobile ? '60px 16px' : '100px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 style={{ color: '#FF8C00', fontWeight: 600, marginBottom: '60px', fontSize: isMobile ? '2rem' : '2.5rem' }}>
            Derniers Articles
          </h2>
          
          {loading ? (
            <p>Chargement des articles...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
              gap: '40px',
              textAlign: 'left'
            }}>
              {posts.map(post => (
                <div key={post.id} style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
                  <img src={post.image_url || '/image/placeholder.png'} alt={post.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                  <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#FF8C00', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{post.category}</span>
                    <h3 style={{ fontSize: '1.5rem', margin: '15px 0', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>{post.title}</h3>
                    <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '25px', fontSize: '0.95rem', textAlign: 'justify', flex: 1 }}>
                      {post.content?.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                    </p>
                    <a href={`#post-${post.id}`} style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #FF8C00', alignSelf: 'flex-start', paddingBottom: '2px', fontSize: '0.9rem' }}>
                      LIRE LA SUITE
                    </a>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p style={{ color: '#aaa', gridColumn: '1/-1', textAlign: 'center' }}>Aucun article disponible pour le moment.</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Blog;
