import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiBookOpen } from 'react-icons/fi';
import { FOOTER_QUICK_LINKS } from '../../constants/navLinks';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto" style={{ backgroundColor: 'var(--scm-warm-brown)' }}>
      <div className="container py-5" style={{ maxWidth: '1280px' }}>
        <div className="row gy-5">
          {/* Brand column */}
          <div className="col-12 col-md-4">
            <div className="mb-3">
              <span style={{ fontFamily: 'var(--scm-font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#FFF8EE', letterSpacing: '-0.01em' }}>
                Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,248,238,0.70)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
              A peaceful, focused learning environment built for Indian students who want structured courses and real progress.
            </p>
            <div className="d-flex gap-3 mt-4">
              {[
                { icon: <FiFacebook size={18} />, label: 'Facebook' },
                { icon: <FiTwitter size={18} />, label: 'Twitter' },
                { icon: <FiInstagram size={18} />, label: 'Instagram' },
                { icon: <FiLinkedin size={18} />, label: 'LinkedIn' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,248,238,0.10)',
                    color: 'rgba(255,248,238,0.75)',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,130,58,0.55)'; e.currentTarget.style.color = '#FFF8EE'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,248,238,0.10)'; e.currentTarget.style.color = 'rgba(255,248,238,0.75)'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-6 col-md-2 offset-md-2">
            <h6 className="mb-4" style={{ color: '#FFF8EE', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Platform
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} style={{ color: 'rgba(255,248,238,0.65)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF8EE')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,248,238,0.65)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact/support */}
          <div className="col-6 col-md-4">
            <h6 className="mb-4" style={{ color: '#FFF8EE', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Support
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ color: 'rgba(255,248,238,0.65)', fontSize: '0.9rem' }}>
              <li>help@edupath.in</li>
              <li>Mon–Sat, 9 AM – 6 PM IST</li>
              <li className="mt-2">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.35rem 0.75rem', borderRadius: 99, background: 'rgba(201,130,58,0.20)', color: 'var(--scm-gold)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <FiBookOpen size={13} /> Learn freely. Grow daily.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,248,238,0.15)', margin: '2.5rem 0 1.5rem' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="mb-0" style={{ color: 'rgba(255,248,238,0.45)', fontSize: '0.82rem' }}>
            &copy; {year} EduPath. All rights reserved. Made with ♥ in India.
          </p>
          <p className="mb-0" style={{ color: 'rgba(255,248,238,0.35)', fontSize: '0.78rem' }}>
            Privacy Policy · Terms of Use
          </p>
        </div>
      </div>
    </footer>
  );
}
