import React, { useEffect } from 'react';
import { ArrowLeft, Clock, User, Calendar, Share2, Tag } from 'lucide-react';

const blogPosts = {
  '1': {
    title: "À la découverte des trésors cachés de Madagascar",
    category: "Aventure",
    image: "/image/hero.png",
    author: "Explor'île Team",
    date: "12 Mai 2024",
    readTime: "5 min",
    content: `
      Madagascar est une terre de mystères et d'aventures. Au-delà des circuits touristiques classiques, l'île cache des trésors insoupçonnés. 
      Imaginez-vous marchant à travers des forêts denses pour découvrir une cascade cristalline dont personne n'a entendu parler, ou visitant un village reculé où les traditions ancestrales sont restées intactes.
      
      Dans cet article, nous vous emmenons hors des sentiers battus pour explorer l'âme véritable de la Grande Île. Nous parlerons des Tsingy de Bemaraha, des parcs nationaux moins connus et de l'importance de voyager de manière responsable pour préserver ces joyaux.
      
      La biodiversité de Madagascar est unique au monde. Plus de 90% de sa faune et de sa flore ne se trouvent nulle part ailleurs sur Terre. Explorer ces trésors cachés, c'est aussi prendre conscience de la fragilité de cet écosystème.
    `
  },
  '2': {
    title: "Guide des traditions locales malgaches",
    category: "Culture",
    image: "/image/mountain.png",
    author: "Jean-Luc R.",
    date: "10 Mai 2024",
    readTime: "7 min",
    content: `
      La culture malgache est un mélange fascinant d'influences africaines et asiatiques. L'un des aspects les plus importants de la vie quotidienne est le concept de "Fady" ou tabous.
      Chaque région, chaque clan a ses propres Fady qui dictent ce qui peut ou ne peut pas être fait. Comprendre ces traditions est essentiel pour tout voyageur souhaitant s'immerger respectueusement dans la société malgache.
      
      Nous explorerons également l'importance de la musique traditionnelle, comme le "Salegy", et le rôle central du riz dans la gastronomie et les rituels sociaux.
    `
  },
  '3': {
    title: "Observation des lémuriens : Guide du débutant",
    category: "Nature",
    image: "/image/hero_new.png",
    author: "Sarah M.",
    date: "08 Mai 2024",
    readTime: "6 min",
    content: `
      Les lémuriens sont les ambassadeurs de Madagascar. Avec plus de 100 espèces différentes, l'île offre un spectacle naturel unique au monde. 
      Du minuscule lémurien microcèbe à l'imposant Indri-Indri avec son cri mélancolique, chaque rencontre est un moment magique.
      
      Dans ce guide, nous vous donnons les meilleurs conseils pour observer ces primates dans leur habitat naturel : quels parcs visiter, à quelle heure de la journée partir en randonnée et comment se comporter pour ne pas perturber leur environnement.
    `
  },
  '4': {
    title: "Nosy Be : L'île aux parfums",
    category: "Plages",
    image: "/image/maldives.png",
    author: "Explor'île Team",
    date: "05 Mai 2024",
    readTime: "4 min",
    content: `
      Nosy Be n'est pas seulement une destination de plage ; c'est une expérience sensorielle. L'air est imprégné de l'odeur sucrée de l'ylang-ylang et de la vanille.
      Les eaux turquoise du canal du Mozambique invitent à la plongée et au snorkeling, révélant des récifs coralliens vibrants de vie.
      
      Découvrez les meilleures plages de l'île, les excursions vers les îles environnantes comme Nosy Komba et Nosy Tanikely, et la vie nocturne animée de Hell-Ville.
    `
  },
  '5': {
    title: "L'Allée des Baobabs : Un spectacle naturel",
    category: "Tourisme",
    image: "/image/mountain.png",
    author: "Pierre D.",
    date: "02 Mai 2024",
    readTime: "5 min",
    content: `
      S'élevant majestueusement au-dessus de la savane, les baobabs de l'Allée des Baobabs sont parmi les arbres les plus emblématiques au monde. 
      Ces géants vieux de plusieurs siècles créent un paysage surréaliste, particulièrement au lever et au coucher du soleil.
      
      Nous partageons avec vous l'histoire de ces "arbres à l'envers", les légendes qui les entourent et les meilleures façons de photographier ce site classé au patrimoine mondial.
    `
  },
  '6': {
    title: "Saveurs de Madagascar : Les plats incontournables",
    category: "Gastronomie",
    image: "/image/hero.png",
    author: "Chef Mamy",
    date: "01 Mai 2024",
    readTime: "8 min",
    content: `
      La cuisine malgache est une aventure pour le palais. Le plat national, le Romazava, est un bouillon de viande et de brèdes (feuilles vertes) riche en saveurs. 
      Le Ravitoto, à base de feuilles de manioc pilées et de viande de porc, est un autre classique à ne pas manquer.
      
      Apprenez-en plus sur les ingrédients locaux, l'importance du piment (Sakay) sur chaque table et les délicieux fruits tropicaux que vous pouvez déguster sur les marchés locaux.
    `
  }
};

const PostDetail = ({ postId }) => {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchPost();
    return () => window.removeEventListener('resize', handleResize);
  }, [postId]);

  useEffect(() => {
    if (!post) return;
    const pageTitle = `${post.title} | Blog Explor'Île`;
    const pageDescription = post.content ? post.content.substring(0, 160).replace(/\s+/g, ' ').trim() + '...' : 'Découvrez cet article du blog Explor\'Île.';
    document.title = pageTitle;
    const setMeta = (selector, attr, value) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', pageDescription);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDescription);
    setMeta('meta[property="og:image"]', 'content', post.image || '/image/hero.png');
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDescription);
    setMeta('meta[name="twitter:image"]', 'content', post.image || '/image/hero.png');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${window.location.origin}${window.location.pathname}#post-${postId}`);
  }, [post, postId]);

  const fetchPost = async () => {
    try {
      const data = await apiService.getPosts();
      const currentPost = data.find(p => String(p.id) === String(postId));
      setPost(currentPost);
    } catch (e) {
      console.error("Error fetching post:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '150px 20px', textAlign: 'center', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <p>Chargement de l'article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: isMobile ? '100px 20px' : '150px 20px', textAlign: 'center', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '20px' }}>Oups ! Article non trouvé</h2>
        <p style={{ color: '#aaa', marginBottom: '40px' }}>L'article que vous recherchez semble avoir disparu dans la jungle.</p>
        <a href="#blog" style={{ 
          backgroundColor: '#FF8C00', 
          color: '#fff', 
          padding: '12px 30px', 
          borderRadius: '50px', 
          textDecoration: 'none',
          fontWeight: 600
        }}>Retour au Blog</a>
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
        <img src={post.image_url || "/image/placeholder.png"} alt={post.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
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
            {post.category}
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
            {post.title}
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
              Retour au Blog
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
            {post.content}
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
              <span style={{ fontWeight: 700, color: '#222' }}>Partager :</span>
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
            }}>Planifier mon aventure</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
