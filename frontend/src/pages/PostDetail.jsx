/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, User, Calendar, Share2, Tag } from 'lucide-react';
import { apiService } from '../services/api';
import { getImageUrl } from '../services/images';
import { useTranslate } from '../i18n/useTranslate';

const PostDetail = ({ postId }) => {
  const { t } = useTranslate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchPost = useCallback(async () => {
    try {
      const data = await apiService.getPosts();
      const currentPost = data.find(p => String(p.id) === String(postId));
      setPost(currentPost);
    } catch (e) {
      console.error("Error fetching post:", e);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchPost();
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchPost]);

  useEffect(() => {
    if (!post) return;
    const pageTitle = `${t(post.title)} | Blog Explor'Île`;
    const pageDescription = post.content ? t(post.content.substring(0, 160)).replace(/\s+/g, ' ').trim() + '...' : 'Découvrez cet article du blog Explor\'Île.';
    document.title = pageTitle;
    const setMeta = (selector, attr, value) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', pageDescription);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDescription);
    setMeta('meta[property="og:image"]', 'content', getImageUrl(post.image_url || post.image, '/image/hero.png'));
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDescription);
    setMeta('meta[name="twitter:image"]', 'content', getImageUrl(post.image_url || post.image, '/image/hero.png'));
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${window.location.origin}${window.location.pathname}#post-${postId}`);
  }, [post, postId, t]);

  if (loading) {
    return (
      <div style={{ padding: '150px 20px', textAlign: 'center', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <p>{t("Chargement de l'article...")}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: isMobile ? '100px 20px' : '150px 20px', textAlign: 'center', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '20px' }}>{t("Oups ! Article non trouvé")}</h2>
        <p style={{ color: '#aaa', marginBottom: '40px' }}>{t("L'article que vous recherchez semble avoir disparu dans la jungle.")}</p>
        <a href="#blog" style={{ 
          backgroundColor: '#FF8C00', 
          color: '#fff', 
          padding: '12px 30px', 
          borderRadius: '50px', 
          textDecoration: 'none',
          fontWeight: 600
        }}>{t("Retour au Blog")}</a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', color: '#333', minHeight: '100vh', paddingBottom: isMobile ? '60px' : '100px' }}>
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        height: isMobile ? '60vh' : '70vh',
        minHeight: isMobile ? '400px' : '500px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingTop: isMobile ? '100px' : '0',
        paddingBottom: isMobile ? '60px' : '80px',
        overflow: 'hidden'
      }}>
        <img src={getImageUrl(post.image_url || post.image)} alt={t(post.title)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)', 
          zIndex: 1 
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 20px', textAlign: 'center', maxWidth: '1000px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: '#FF8C00', 
            color: '#fff', 
            padding: '6px 16px', 
            borderRadius: '50px', 
            fontSize: isMobile ? '0.75rem' : '0.85rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            marginBottom: isMobile ? '16px' : '24px'
          }}>
            <Tag size={14} />
            {t(post.category)}
          </div>
          <h1 style={{ 
            fontSize: isMobile ? '1.8rem' : 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 800, 
            color: '#fff', 
            marginBottom: isMobile ? '24px' : '32px', 
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.2,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            {t(post.title)}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: isMobile ? '16px' : '24px', 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={isMobile ? 16 : 18} color="#FF8C00" />
              <span>Explor'île Team</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={isMobile ? 16 : 18} color="#FF8C00" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '40px 20px', position: 'relative', zIndex: 5, marginTop: isMobile ? '-20px' : '-40px' }}>
        <div className="container" style={{ 
          maxWidth: '850px', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          padding: isMobile ? '30px 20px' : '60px 50px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          {/* Breadcrumb / Back button */}
          <div style={{ marginBottom: isMobile ? '24px' : '40px' }}>
            <a href="#blog" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              color: '#666', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#FF8C00'}
            onMouseOut={(e) => e.target.style.color = '#666'}
            >
              <ArrowLeft size={20} />
              {t("Retour au Blog")}
            </a>
          </div>

          <div style={{ 
            lineHeight: isMobile ? 1.7 : 1.9, 
            fontSize: isMobile ? '1rem' : '1.2rem', 
            color: '#444', 
            whiteSpace: 'pre-line',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textAlign: 'justify'
          }}>
            {t(post.content)}
          </div>

          {/* Share / Social */}
          <div style={{ 
            marginTop: isMobile ? '40px' : '80px', 
            paddingTop: isMobile ? '30px' : '40px', 
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 700, color: '#222' }}>{t("Partager :")}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ backgroundColor: '#f5f5f5', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 size={18} color="#FF8C00" /></button>
              </div>
            </div>
            <a href="#contact" style={{ 
              backgroundColor: '#1B5E20', 
              color: '#fff', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 600,
              fontSize: '0.9rem',
              width: isMobile ? '100%' : 'auto',
              textAlign: 'center'
            }}>{t("Planifier mon aventure")}</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
