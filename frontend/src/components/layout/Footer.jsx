import React from 'react';
import { User } from 'lucide-react';

const Footer = () => {
  return (
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
              <li><a href="https://web.facebook.com/people/Explor%C3%AEle/61586538714640/#">
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
  );
};

export default Footer;
