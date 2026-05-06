import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Destination from './pages/Destination';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Details from './pages/Details';
import './index.css';

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
  const isPostPage = currentHash.startsWith('#post-');
  const postId = isPostPage ? currentHash.split('-')[1] : null;

  const isScrolledOrInnerPage = scrolled || isDestinationPage || isDetailPage || isContactPage || isBlogPage || isPostPage;
  const linkColor = (active) => active ? '#FF8C00' : (isScrolledOrInnerPage ? '#222' : '#fff');

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
            <a href="#detail" style={{ color: linkColor(isDetailPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>Détail</a>
            <a href="#contact" style={{ color: linkColor(isContactPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>Contact</a>
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
          <a href="#detail" onClick={() => setMobileMenuOpen(false)} style={{ color: isDetailPage ? '#FF8C00' : '#222' }}>Détail</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: isContactPage ? '#FF8C00' : '#222' }}>Contact</a>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1 }}>
        {isPostPage ? <PostDetail postId={postId} /> : isBlogPage ? <Blog /> : isContactPage ? <Contact /> : isDestinationPage ? <Destination /> : isDetailPage ? <Details /> : <Home />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-container" style={{ alignItems: 'flex-start' }}>
              <div className="footer-logo" style={{ alignSelf: 'flex-start', width: '100%' }}>
                <img src="/image/Logo.png" alt="Logo" style={{ height: '100px', width: '100%', objectFit: 'contain', objectPosition: 'left', marginBottom: '16px' }} />
              </div>
              <p className="footer-address">
                Antananarivo,<br />
                Madagascar
              </p>
              <p style={{ color: '#aaa', lineHeight: 1.6 }}>
                Explor’île vous invite à découvrir Madagascar au-delà des sentiers battus à travers un tourisme culturel, authentique et responsable.
              </p>
              <a href="mailto:contact@explorile.mg" className="footer-email">contact@explorile.mg</a>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
