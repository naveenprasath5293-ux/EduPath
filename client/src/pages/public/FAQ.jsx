import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import { ROUTES } from '../../constants/routePaths';
import Button from '../../components/ui/Button';

const FAQS = [
  { q: 'How do I enroll in a course?', a: 'Browse the course catalog, click on any course you\'re interested in, and click "Enroll Now". If you\'re not signed in, you\'ll be prompted to create a free account first.' },
  { q: 'Is it free to join EduPath?', a: 'Yes! Creating an account on EduPath is completely free. Individual courses may have their own pricing — each course page shows the price clearly in Indian Rupees (₹).' },
  { q: 'Will I get a certificate on completion?', a: 'Yes. EduPath issues completion certificates for all courses. Your certificate is available for download once you complete all lessons and mark the course as complete.' },
  { q: 'Can I learn at my own pace?', a: 'Absolutely. All courses on EduPath are self-paced. You can start, pause, and resume anytime. Your progress is saved automatically.' },
  { q: 'What devices can I use to access EduPath?', a: 'EduPath works on desktop, tablet, and mobile. Our platform is fully responsive so you can learn wherever you are.' },
  { q: 'How do I contact support?', a: 'Visit our Contact page or email us at help@edupath.in. We typically respond within 24 hours on business days (Mon–Sat).' },
  { q: 'Can I update my profile information?', a: 'Yes. Go to your Student Dashboard and use the "My Profile" section to update your name, phone number, and profile image.' },
];

export default function FAQ() {
  return (
    <div style={{ background: 'var(--scm-background)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6B4F3A 0%, #C9823A 100%)', padding: '4rem 0 3rem' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span variants={fadeInUp} style={{ display: 'inline-block', background: 'rgba(255,248,238,0.15)', color: '#FFF8EE', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', border: '1px solid rgba(255,248,238,0.25)', marginBottom: '1rem' }}>
              Help Center
            </motion.span>
            <motion.h1 variants={fadeInUp} style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontFamily: 'var(--scm-font-display)', marginBottom: '0.75rem' }}>
              Frequently Asked Questions
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.80)', fontSize: '1rem' }}>
              Everything you need to know about EduPath.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <section className="page-section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="accordion" id="faqAccordion">
            {FAQS.map((item, index) => (
              <motion.div
                key={item.q}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="accordion-item mb-3 overflow-hidden"
                style={{ border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-sm) !important', background: 'var(--scm-card-bg)' }}
              >
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-${index}`}
                    style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--scm-text)', background: 'var(--scm-card-bg)' }}
                  >
                    {item.q}
                  </button>
                </h2>
                <div id={`faq-${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body" style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.75, fontSize: '0.9rem' }}>{item.a}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p style={{ color: 'var(--scm-text-secondary)', marginBottom: '1rem' }}>Still have questions?</p>
            <Link to={ROUTES.CONTACT}>
              <Button variant="primary">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
