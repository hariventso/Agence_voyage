import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, ...navbarProps }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar {...navbarProps} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
