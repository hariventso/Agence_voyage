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

  // Routing Logic
  const isDestinationPage = currentHash === '#destinations';
  const isContactPage = currentHash === '#contact';
  const isBlogPage = currentHash === '#blog';
  const isDetailPage = currentHash.startsWith('#detail-');
  const destinationIdDetail = isDetailPage ? currentHash.split('-')[1] : null;
  
  const isViewPage = currentHash.startsWith('#view-');
  const destinationIdView = isViewPage ? currentHash.split('-')[1] : null;

  const isAboutPage = currentHash === '#about';
  const isAdminPage = currentHash === '#admin';
  const isPostPage = currentHash.startsWith('#post-');
  const postId = isPostPage ? currentHash.split('-')[1] : null;

  const isScrolledOrInnerPage = scrolled || isDestinationPage || isDetailPage || isViewPage || isAboutPage || isContactPage || isBlogPage || isPostPage;

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
          <Destination />
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
