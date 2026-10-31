import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser, FiBookOpen, FiGrid, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useDisclosure from '../../hooks/useDisclosure';
import { NAV_LINKS } from '../../constants/navLinks';
import { ROUTES } from '../../constants/routePaths';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isOpen, toggle, close } = useDisclosure(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    close();
    await logout();
    toast.success('Logged out successfully');
    navigate(isAdmin ? ROUTES.ADMIN_LOGIN : ROUTES.STUDENT_LOGIN, { replace: true });
  };

  const authLinks = isAdmin
    ? [
        { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <FiGrid size={15} /> },
        { label: 'Courses', path: ROUTES.ADMIN_COURSE_LIST, icon: <FiBookOpen size={15} /> },
      ]
    : [
        { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: <FiGrid size={15} /> },
        { label: 'Courses', path: ROUTES.COURSES, icon: <FiBookOpen size={15} /> },
      ];

  return (
    <nav className="navbar sticky-top" style={{ zIndex: 1030 }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        {/* Brand */}
        <Link
          to={isAuthenticated ? (isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD) : ROUTES.HOME}
          className="navbar-brand"
          onClick={close}
          style={{ fontFamily: 'var(--scm-font-display)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em' }}
        >
          Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="border-0 bg-transparent d-lg-none p-2 ms-auto"
          type="button"
          onClick={toggle}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          style={{ color: 'var(--scm-text)', lineHeight: 1 }}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="d-none d-lg-flex align-items-center gap-4 ms-auto">
          {isAuthenticated ? (
            <>
              {authLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `nav-link fw-medium d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}
                >
                  {link.icon}{link.label}
                </NavLink>
              ))}
              <div className="d-flex align-items-center gap-2 ms-2 ps-2" style={{ borderLeft: '1px solid var(--scm-border)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiUser size={15} />
                </div>
                <span className="small fw-medium" style={{ color: 'var(--scm-text)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.fullName?.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ color: 'var(--scm-text-secondary)', background: 'none', border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-xs)', padding: '0.3rem 0.7rem' }}
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `nav-link fw-medium ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to={ROUTES.STUDENT_LOGIN} className="nav-link fw-medium">
                Sign In
              </NavLink>
              {/* Subtle Admin Portal link — visually de-emphasised */}
              <NavLink
                to={ROUTES.ADMIN_LOGIN}
                className="nav-link d-flex align-items-center gap-1"
                style={{ color: 'var(--scm-text-muted)', fontSize: '0.82rem' }}
                title="Admin Portal"
              >
                <FiShield size={13} />
                <span>Admin</span>
              </NavLink>
              <Link to={ROUTES.STUDENT_REGISTER}>
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="d-lg-none w-100"
            style={{ borderTop: '1px solid var(--scm-border)', backgroundColor: 'rgba(255,248,238,0.98)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            <div className="container d-flex flex-column gap-1 py-4" style={{ maxWidth: '1280px' }}>
              {isAuthenticated ? (
                <>
                  {authLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className="nav-link fw-medium d-flex align-items-center gap-2 py-2"
                      onClick={close}
                    >
                      {link.icon}{link.label}
                    </NavLink>
                  ))}
                  <hr style={{ borderColor: 'var(--scm-border)' }} />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn d-flex align-items-center gap-2 text-start"
                    style={{ color: 'var(--scm-text-secondary)', background: 'none', border: 'none', padding: '0.5rem 0' }}
                  >
                    <FiLogOut size={15} /> Logout ({user?.fullName?.split(' ')[0]})
                  </button>
                </>
              ) : (
                <>
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className="nav-link fw-medium py-2"
                      onClick={close}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  <hr style={{ borderColor: 'var(--scm-border)' }} />
                  <NavLink to={ROUTES.STUDENT_LOGIN} className="nav-link fw-medium py-2" onClick={close}>
                    Sign In
                  </NavLink>
                  {/* Admin Portal — mobile */}
                  <NavLink
                    to={ROUTES.ADMIN_LOGIN}
                    className="nav-link d-flex align-items-center gap-2 py-2"
                    style={{ color: 'var(--scm-text-muted)', fontSize: '0.85rem' }}
                    onClick={close}
                  >
                    <FiShield size={14} /> Admin Portal
                  </NavLink>
                  <Link to={ROUTES.STUDENT_REGISTER} onClick={close}>
                    <Button variant="primary" className="w-100 mt-1">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
