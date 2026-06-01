import { Menu, X, User } from 'lucide-react';
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher';
import { useTranslate } from '../../i18n/useTranslate';

const Navbar = ({
  isScrolledOrInnerPage,
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  currentHash,
  isDestinationPage,
  isBlogPage,
  isPostPage,
  isAboutPage,
  isContactPage,
  isAdminPage
}) => {
  const { t } = useTranslate();
  const linkColor = (active) => active ? '#FF8C00' : (isScrolledOrInnerPage ? '#222' : '#fff');

  return (
    <nav className={`navbar ${isScrolledOrInnerPage ? 'scrolled' : ''}`} style={{
      background: isScrolledOrInnerPage ? 'rgba(255, 255, 255, 0.97)' : 'transparent',
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
        <div className="nav-links nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#" style={{ color: linkColor(currentHash === '' || currentHash === '#'), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>{t("Accueil")}</a>
          <a href="#destinations" style={{ color: linkColor(isDestinationPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>{t("Circuits")}</a>
          <a href="#blog" style={{ color: linkColor(isBlogPage || isPostPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>{t("Blog")}</a>
          <a href="#about" style={{ color: linkColor(isAboutPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>{t("À propos")}</a>
          <a href="#contact" style={{ color: linkColor(isContactPage), fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>{t("Contact")}</a>
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
          <LanguageSwitcher />
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
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher />
        </div>
        <a href="#" onClick={() => setMobileMenuOpen(false)} style={{ color: currentHash === '' || currentHash === '#' ? '#FF8C00' : '#222' }}>{t("Accueil")}</a>
        <a href="#destinations" onClick={() => setMobileMenuOpen(false)} style={{ color: isDestinationPage ? '#FF8C00' : '#222' }}>{t("Destinations")}</a>
        <a href="#blog" onClick={() => setMobileMenuOpen(false)} style={{ color: isBlogPage || isPostPage ? '#FF8C00' : '#222' }}>{t("Blog")}</a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: isAboutPage ? '#FF8C00' : '#222' }}>{t("À propos")}</a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: isContactPage ? '#FF8C00' : '#222' }}>{t("Contact")}</a>
        <a href="#admin" onClick={() => setMobileMenuOpen(false)} style={{
          color: isAdminPage ? '#FF8C00' : '#222',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid #eee'
        }}>
          <User size={18} /> {t("Admin")}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
