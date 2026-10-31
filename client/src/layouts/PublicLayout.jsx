import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: 'var(--scm-background)' }}>
      <Navbar />
      <main className="flex-grow-1">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
