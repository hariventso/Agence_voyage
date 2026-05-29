import React, { useState, useEffect, Suspense, lazy } from 'react';
import './index.css';
import Layout from './components/layout/Layout';
import PageLoader from './components/ui/PageLoader';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Destination = lazy(() => import('./pages/Destination'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Details = lazy(() => import('./pages/Details'));
const DestinationOverview = lazy(() => import('./pages/DestinationOverview'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const getCurrentRoute = () =>
    window.location.pathname === '/admin' ? '#admin' : window.location.hash || '#';
  const [currentHash, setCurrentHash] = useState(getCurrentRoute);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(getCurrentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    if (window.location.pathname === '/admin' && window.location.hash !== '#admin') {
      window.history.replaceState(null, '', '/admin#admin');
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Routing Logic
  const isDestinationPage = currentHash.startsWith('#destinations');
  const isContactPage = currentHash === '#contact';
  const isBlogPage = currentHash === '#blog';
  const isDetailPage = currentHash.startsWith('#detail-');
  const destinationIdDetail = isDetailPage ? currentHash.replace('#detail-', '') : null;
  
  const isViewPage = currentHash.startsWith('#view-');
  const destinationIdView = isViewPage ? currentHash.replace('#view-', '') : null;
  const destinationServiceFilter = isDestinationPage && currentHash.includes('?service=') ? decodeURIComponent(currentHash.split('?service=')[1]) : null;

  const isAboutPage = currentHash === '#about';
  const isAdminPage = currentHash === '#admin';
  const isPostPage = currentHash.startsWith('#post-');
  const postId = isPostPage ? currentHash.replace('#post-', '') : null;

  const isScrolledOrInnerPage = scrolled || isDestinationPage || isDetailPage || isViewPage || isAboutPage || isContactPage || isBlogPage || isPostPage;

  useEffect(() => {
    const updateMeta = (selector, attr, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[')) {
          const attrMatch = selector.match(/\[(.*?)\]/);
          if (attrMatch) {
            const [name, val] = attrMatch[1].split('=');
            element.setAttribute(name.trim(), val.replace(/"/g, '').trim());
          }
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    const setMetaTag = (name, content) => updateMeta(`meta[name="${name}"]`, 'content', content);
    const setMetaProperty = (property, content) => updateMeta(`meta[property="${property}"]`, 'content', content);
    const setLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    const baseUrl = window.location.origin;
    let title = "Explor'Île - Agence de voyages à Madagascar";
    let description = "Explor'Île propose des voyages authentiques à Madagascar : circuits culturels, séjours balnéaires et aventures responsables.";

    if (isAboutPage) {
      title = "À propos - Explor'Île | Voyage culturel à Madagascar";
      description = "Découvrez l'histoire, l'équipe et la mission d'Explor'Île, spécialiste du voyage authentique à Madagascar.";
    } else if (isContactPage) {
      title = "Contact - Explor'Île | Demande de voyage et devis";
      description = "Contactez Explor'Île pour un devis personnalisé ou une demande de voyage à Madagascar.";
    } else if (isBlogPage) {
      title = "Blog Voyage Madagascar - Explor'Île";
      description = "Récits, conseils et idées de voyages à Madagascar pour préparer votre séjour responsable.";
    } else if (isDestinationPage) {
      title = destinationServiceFilter
        ? `Destinations ${destinationServiceFilter} - Explor'Île`
        : "Destinations Madagascar - Explor'Île";
      description = destinationServiceFilter
        ? `Découvrez nos circuits ${destinationServiceFilter} à Madagascar, sélectionnés pour répondre à votre voyage sur mesure.`
        : "Explorez nos meilleures destinations à Madagascar : circuits, séjours balnéaires et aventures sur mesure.";
    } else if (isDetailPage) {
      title = "Détails de destination - Explor'Île";
      description = "Découvrez le détail du circuit et réservez votre voyage authentique à Madagascar.";
    } else if (isViewPage) {
      title = "Destination en détail - Explor'Île";
      description = "Informations détaillées sur la destination et les offres de voyage à Madagascar.";
    } else if (isPostPage) {
      title = "Article Blog - Explor'Île Madagascar";
      description = "Lisez des articles de blog sur Madagascar, la culture locale et les meilleures expériences de voyage.";
    }

    document.title = title;
    setMetaTag('description', description);
    setMetaTag('keywords', 'voyage Madagascar, tourisme durable, circuit culturel, séjour balnéaire, explor ile, agence de voyage');
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', `${baseUrl}${window.location.pathname}${window.location.hash}`);
    setMetaProperty('og:image', '/image/hero.png');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', '/image/hero.png');
    setLink('canonical', `${baseUrl}${window.location.pathname}${window.location.hash}`);
  }, [currentHash]);

  if (isAdminPage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <Layout 
      isScrolledOrInnerPage={isScrolledOrInnerPage}
      scrolled={scrolled}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      currentHash={currentHash}
      isDestinationPage={isDestinationPage}
      isBlogPage={isBlogPage}
      isPostPage={isPostPage}
      isAboutPage={isAboutPage}
      isContactPage={isContactPage}
      isAdminPage={isAdminPage}
    >
      <Suspense fallback={<PageLoader />}>
        {isPostPage ? (
          <PostDetail postId={postId} />
        ) : isBlogPage ? (
          <Blog />
        ) : isContactPage ? (
          <Contact />
        ) : isDestinationPage ? (
          <Destination serviceFilter={destinationServiceFilter} />
        ) : isDetailPage ? (
          <Details destinationId={destinationIdDetail} />
        ) : isViewPage ? (
          <DestinationOverview destinationId={destinationIdView} />
        ) : isAboutPage ? (
          <About />
        ) : (
          <Home />
        )}
      </Suspense>
    </Layout>
  );
}

export default App;
