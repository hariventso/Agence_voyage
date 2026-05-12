import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, X, User } from 'lucide-react';
import './index.css';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Destination = lazy(() => import('./pages/Destination'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Details = lazy(() => import('./pages/Details'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));

// Loading component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#0A2E36', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
  </div>
);

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Determine which page we are on
  const isDestinationPage = currentHash === '#destinations';
  const isContactPage = currentHash === '#contact';
  const isBlogPage = currentHash === '#blog';
  const isDetailPage = currentHash === '#detail';
  const isAboutPage = currentHash === '#about';
  const isAdminPage = currentHash === '#admin';
  const isPostPage = currentHash.startsWith('#post-');
  const postId = isPostPage ? currentHash.split('-')[1] : null;

  const isScrolledOrInnerPage = scrolled || isDestinationPage || isDetailPage || isAboutPage || isContactPage || isBlogPage || isPostPage;
  const linkColor = (active) => active ? '#FF8C00' : (isScrolledOrInnerPage ? '#222' : '#fff');

  if (isAdminPage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav className={`navbar ${isScrolledOrInnerPage ? 'scrolled' : ''}`} style={{
        background: isScrolledOrInnerPage ? 'rgba(255, 255, 255, 0.97)' : 'transparent',
        padding: scrolled ? '12px 0' : '20px 0',
        backdropFilter: isScrolledOrInnerPage ? 'blur(10px)' : 'none',
        boxShadow: isScrolledOrInnerPage ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          {/* Logo */}
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#">
              <img src="/image/Logo.png" alt="Explor'île Logo" style={{ height: '72px', objectFit: 'contain' }} />
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="nav-links nav-links-desktop">
            <a href="#" style={{ color: linkColor(currentHash === '' || currentHash === '#'), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>Accueil</a>
            <a href="#destinations" style={{ color: linkColor(isDestinationPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>Destinations</a>
            <a href="#blog" style={{ color: linkColor(isBlogPage || isPostPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>Blog</a>
            <a href="#about" style={{ color: linkColor(isAboutPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>À propos</a>
            <a href="#contact" style={{ color: linkColor(isContactPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>Contact</a>
            <a href="#admin" title="Admin" style={{
              color: linkColor(isAdminPage),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isScrolledOrInnerPage ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s'
            }}>
              <User size={18} />
            </a>
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isScrolledOrInnerPage ? '#222' : '#fff',
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#" onClick={() => setMobileMenuOpen(false)} style={{ color: currentHash === '' || currentHash === '#' ? '#FF8C00' : '#222' }}>Accueil</a>
          <a href="#destinations" onClick={() => setMobileMenuOpen(false)} style={{ color: isDestinationPage ? '#FF8C00' : '#222' }}>Destinations</a>
          <a href="#blog" onClick={() => setMobileMenuOpen(false)} style={{ color: isBlogPage || isPostPage ? '#FF8C00' : '#222' }}>Blog</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: isAboutPage ? '#FF8C00' : '#222' }}>À propos</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: isContactPage ? '#FF8C00' : '#222' }}>Contact</a>
          <a href="#admin" onClick={() => setMobileMenuOpen(false)} style={{
            color: isAdminPage ? '#FF8C00' : '#222',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #eee'
          }}>
            <User size={18} /> Admin
          </a>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          {isPostPage ? <PostDetail postId={postId} /> : isBlogPage ? <Blog /> : isContactPage ? <Contact /> : isDestinationPage ? <Destination /> : isDetailPage ? <Details /> : isAboutPage ? <About /> : <Home />}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-container">
              <div className="footer-logo">
                <img src="/image/Logo.png" alt="Logo" style={{ height: '80px', objectFit: 'contain', objectPosition: 'left', marginBottom: '12px' }} />
              </div>
              <p className="footer-address" style={{ marginBottom: '12px' }}>
                Antananarivo,<br />
                Madagascar
              </p>
              <p style={{ color: '#aaa', lineHeight: 1.5, fontSize: '14px', marginBottom: '12px' }}>
                Explor’île vous invite à découvrir Madagascar au-delà des sentiers battus à travers un tourisme culturel, authentique et responsable.
              </p>
              <a href="mailto:contact@domain.com" className="footer-email">contact@domain.com</a>
            </div>

            <div className="footer-col">
              <h4>Explor’île</h4>
              <ul>
                <li><a href="#">Pourquoi nous choisir ?</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Informations</h4>
              <ul>
                <li><a href="#">Mentions Légales</a></li>
                <li><a href="#">Politique de confidentialité</a></li>
                <li><a href="#">Conditions Générales</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Social</h4>
              <ul>
                <li><a href="#">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  Facebook
                </a></li>
                <li><a href="#">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  Instagram
                </a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-info">
            <span className="footer-disclaimer">Explor’île - Agence de tourisme culturel et d'aventure à Madagascar.</span>
            <span className="footer-lang">Français</span>
          </div>

          <div className="footer-copyright">
            <p>Copyright © 2026 Explor’île. Tous droits réservés.</p>
            <div className="footer-legal-links">
              <a href="#">Cookies</a>
              <a href="#">Confidentialité</a>
              <a href="#admin" style={{ opacity: 0.3 }}>Administration</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
