import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routePaths';

const values = [
  { icon: <FiBookOpen size={22} />, title: 'Structured Learning', desc: 'Every course is carefully structured so you always know what to do next.' },
  { icon: <FiHeart size={22} />, title: 'Peaceful Environment', desc: 'Distraction-free, calm interface designed for deep focus and real learning.' },
  { icon: <FiAward size={22} />, title: 'Real Outcomes', desc: 'We measure success by your progress, not just enrollment numbers.' },
  { icon: <FiUsers size={22} />, title: 'Built for India', desc: 'Affordable, practical courses designed with the Indian learner in mind.' },
];

export default function About() {
  return (
    <div style={{ background: 'var(--scm-background)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #6B4F3A 0%, #C9823A 100%)', padding: '4rem 0 3.5rem' }}>
        <div className="container text-center" style={{ maxWidth: '700px' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span variants={fadeInUp} style={{ display: 'inline-block', background: 'rgba(255,248,238,0.15)', color: '#FFF8EE', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', border: '1px solid rgba(255,248,238,0.25)', marginBottom: '1rem' }}>
              Our Story
            </motion.span>
            <motion.h1 variants={fadeInUp} style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontFamily: 'var(--scm-font-display)', marginBottom: '1rem' }}>
              About EduPath
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.80)', fontSize: '1.05rem', lineHeight: 1.75, margin: '0 auto' }}>
              EduPath was built with one belief — learning should feel peaceful, structured, and rewarding. We're on a mission to make quality education accessible to every Indian student.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Mission */}
      <section className="page-section">
        <div className="container" style={{ maxWidth: '1280px' }}>
          <div className="row align-items-center gy-5">
            <div className="col-12 col-lg-6">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span style={{ display: 'inline-block', background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Our Mission
                </span>
                <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', marginBottom: '1rem' }}>
                  Learning that fits your life.
                </h2>
                <p style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                  We believe every student in India deserves access to high-quality, structured online education — without the clutter, noise, or distraction of big platforms.
                </p>
                <p style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                  EduPath is designed to be simple, warm, and effective — so you can focus entirely on learning and growing at your own pace.
                </p>
                <Link to={ROUTES.COURSES}>
                  <Button variant="primary">Explore Courses</Button>
                </Link>
              </motion.div>
            </div>
            <div className="col-12 col-lg-5 offset-lg-1">
              <div className="row g-3">
                {values.map((v, i) => (
                  <div key={v.title} className="col-12 col-sm-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', height: '100%' }}
                    >
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                        {v.icon}
                      </div>
                      <h6 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{v.title}</h6>
                      <p style={{ fontSize: '0.855rem', color: 'var(--scm-text-secondary)', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
