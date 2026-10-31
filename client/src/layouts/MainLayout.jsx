import { Outlet, useLocation, NavLink, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiMenu, FiX, FiLogOut, FiBookOpen, FiGrid, FiUser, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routePaths';

export default function MainLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const firstName = user?.fullName?.split(' ')[0] || '';

  const links = isAdmin
    ? [
        { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD, icon: <FiGrid size={16} /> },
        { label: 'Courses', to: ROUTES.ADMIN_COURSE_LIST, icon: <FiBookOpen size={16} /> },
        { label: 'Add Course', to: ROUTES.ADMIN_COURSE_ADD, icon: <FiList size={16} /> },
      ]
    : [
        { label: 'Dashboard', to: ROUTES.STUDENT_DASHBOARD, icon: <FiGrid size={16} /> },
        { label: 'Courses', to: ROUTES.COURSES, icon: <FiBookOpen size={16} /> },
        { label: 'Profile', to: ROUTES.STUDENT_DASHBOARD + '#profile', icon: <FiUser size={16} /> },
      ];

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    toast.success('Logged out successfully');
    navigate(isAdmin ? ROUTES.ADMIN_LOGIN : ROUTES.STUDENT_LOGIN, { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: 'var(--scm-section-bg)' }}>
      {/* Authenticated header */}
      <header style={{
        background: 'rgba(255,248,238,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--scm-border)',
        boxShadow: 'var(--scm-shadow-card)',
        position: 'sticky', top: 0, zIndex: 1030,
      }}>
        <div className="container d-flex align-items-center gap-4 py-3" style={{ maxWidth: '1280px' }}>
          {/* Brand */}
          <Link
            to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
            style={{ fontFamily: 'var(--scm-font-display)', fontWeight: 800, fontSize: '1.35rem', color: 'var(--scm-primary)', letterSpacing: '-0.02em', textDecoration: 'none', flexShrink: 0 }}
          >
            Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
          </Link>

          {/* Admin badge */}
          {isAdmin && (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(201,130,58,0.12)', color: 'var(--scm-primary)', borderRadius: 99, padding: '0.2rem 0.65rem', border: '1px solid rgba(201,130,58,0.25)' }}>
              Admin
            </span>
          )}

          {/* Desktop nav */}
          <nav className="d-none d-md-flex align-items-center gap-3 ms-2">
            {links.filter(l => !l.to.includes('#')).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `d-flex align-items-center gap-2 fw-medium text-decoration-none ${isActive ? '' : ''}`}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--scm-primary)' : 'var(--scm-text)',
                  fontSize: '0.875rem',
                  padding: '0.3rem 0',
                  borderBottom: isActive ? '2px solid var(--scm-primary)' : '2px solid transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                })}
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="d-none d-md-flex align-items-center gap-3 ms-auto">
            <div className="d-flex align-items-center gap-2 px-2 py-1" style={{ borderRadius: 'var(--scm-radius-xs)', background: 'var(--scm-section-bg)', border: '1px solid var(--scm-border)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--scm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--scm-primary)', flexShrink: 0 }}>
                <FiUser size={13} />
              </div>
              <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--scm-text)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstName}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-sm d-flex align-items-center gap-2"
              style={{ color: 'var(--scm-text-secondary)', background: 'none', border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-xs)', padding: '0.3rem 0.75rem', fontSize: '0.83rem', fontWeight: 500 }}
            >
              <FiLogOut size={13} /> Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="d-md-none ms-auto border-0 bg-transparent p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: 'var(--scm-text)', lineHeight: 1 }}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ borderTop: '1px solid var(--scm-border)', background: 'rgba(255,248,238,0.98)', overflow: 'hidden' }}
            >
              <div className="container d-flex flex-column gap-1 py-3" style={{ maxWidth: '1280px' }}>
                {links.filter(l => !l.to.includes('#')).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="d-flex align-items-center gap-2 py-2 text-decoration-none fw-medium"
                    style={{ color: 'var(--scm-text)', fontSize: '0.9rem' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span style={{ color: 'var(--scm-primary)' }}>{link.icon}</span> {link.label}
                  </NavLink>
                ))}
                <hr style={{ borderColor: 'var(--scm-border)', margin: '0.25rem 0' }} />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn text-start d-flex align-items-center gap-2 py-2"
                  style={{ color: 'var(--scm-text-secondary)', background: 'none', border: 'none', fontSize: '0.9rem', padding: '0.5rem 0' }}
                >
                  <FiLogOut size={14} /> Logout ({firstName})
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
