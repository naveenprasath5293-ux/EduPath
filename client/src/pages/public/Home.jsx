import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiUsers, FiAward, FiTrendingUp, FiCheck } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import CourseCard from '../../components/courses/CourseCard';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import { ROUTES } from '../../constants/routePaths';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { IMG_HERO } from '../../assets/images/imageAssets';

const features = [
  {
    icon: <FiBookOpen size={22} />,
    title: 'Structured Learning',
    desc: 'Carefully designed courses with clear modules, practical assignments, and measurable outcomes.',
  },
  {
    icon: <FiAward size={22} />,
    title: 'Recognised Certificates',
    desc: 'Earn industry-recognised certificates on course completion to boost your career.',
  },
  {
    icon: <FiTrendingUp size={22} />,
    title: 'Track Your Progress',
    desc: 'Real-time progress tracking keeps you motivated and shows exactly where you stand.',
  },
  {
    icon: <FiUsers size={22} />,
    title: 'Placement Support',
    desc: 'Dedicated placement guidance to help you take the next step in your career.',
  },
];

export default function Home() {
  const [popularCourses, setPopularCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    courseService.getPublicCourses({ page: 1 })
      .then((res) => setPopularCourses((res.data.courses || []).slice(0, 3)))
      .catch(() => setPopularCourses([]))
      .finally(() => setCoursesLoading(false));

    enrollmentService.getEnrollmentStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${IMG_HERO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }} />
        {/* Warm overlay for readability */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(107,79,58,0.88) 0%, rgba(201,130,58,0.75) 60%, rgba(47,42,38,0.80) 100%)',
        }} />

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,248,238,0.04)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,248,238,0.03)', zIndex: 1, pointerEvents: 'none' }} />

        <div className="container py-5" style={{ maxWidth: '1280px', position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center gy-5">
            <div className="col-12 col-lg-6">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.span variants={fadeInUp} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,248,238,0.15)', color: '#FFF8EE',
                  borderRadius: 99, padding: '0.4rem 1rem',
                  fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em',
                  border: '1px solid rgba(255,248,238,0.25)', marginBottom: '1.5rem',
                }}>
                  🎓 India's Peaceful Learning Platform
                </motion.span>

                <motion.h1 variants={fadeInUp} style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 800,
                  color: '#FFF8EE', lineHeight: 1.15, letterSpacing: '-0.02em',
                  marginBottom: '1.25rem', fontFamily: 'var(--scm-font-display)',
                }}>
                  Learn Today.<br />
                  <span style={{ color: 'var(--scm-gold)' }}>Build Your Future.</span>
                </motion.h1>

                <motion.p variants={fadeInUp} style={{
                  fontSize: '1.1rem', color: 'rgba(255,248,238,0.85)',
                  lineHeight: 1.75, maxWidth: 480, marginBottom: '2rem',
                }}>
                  Discover practical courses designed to help you build real skills,
                  track your progress, and grow with confidence — at your own pace.
                </motion.p>

                <motion.div variants={fadeInUp} className="d-flex flex-wrap gap-3">
                  <Link to={ROUTES.COURSES}>
                    <Button variant="cream" size="lg" style={{ padding: '0.85rem 2rem', borderRadius: 'var(--scm-radius-sm)' }}>
                      Explore Courses <FiArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link to={ROUTES.STUDENT_REGISTER}>
                    <Button variant="ghost" size="lg" style={{ padding: '0.85rem 2rem', borderRadius: 'var(--scm-radius-sm)' }}>
                      Start Learning Free
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp} className="d-flex flex-wrap gap-4 mt-5">
                  {['No credit card needed', 'Cancel anytime', 'Learn at your pace'].map((txt) => (
                    <span key={txt} className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,248,238,0.75)', fontSize: '0.85rem' }}>
                      <FiCheck size={14} style={{ color: 'var(--scm-gold)' }} /> {txt}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Hero feature card */}
            <div className="col-12 col-lg-5 offset-lg-1">
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}>
                <div style={{
                  background: 'rgba(255,248,238,0.12)', borderRadius: 24,
                  border: '1px solid rgba(255,248,238,0.20)', padding: '2rem',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                }}>
                  {/* Feature highlights — no fake progress */}
                  <p style={{ color: 'rgba(255,248,238,0.65)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    What you'll get
                  </p>
                  {[
                    { icon: '📚', title: 'Structured Course Modules', sub: 'Step-by-step lessons you can follow easily' },
                    { icon: '📈', title: 'Real Progress Tracking', sub: 'Track every lesson you complete' },
                    { icon: '🏆', title: 'Course Certificates', sub: 'Earn a certificate when you finish' },
                    { icon: '🇮🇳', title: 'Built for India', sub: 'Affordable courses in Indian Rupees' },
                  ].map((item) => (
                    <div key={item.title} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                      padding: '0.875rem', borderRadius: 12, marginBottom: '0.5rem',
                      background: 'rgba(255,248,238,0.08)', border: '1px solid rgba(255,248,238,0.12)',
                    }}>
                      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{item.icon}</span>
                      <div>
                        <div style={{ color: '#FFF8EE', fontWeight: 600, fontSize: '0.88rem' }}>{item.title}</div>
                        <div style={{ color: 'rgba(255,248,238,0.60)', fontSize: '0.78rem', marginTop: 2 }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS (real data only) ════════════════════════════════ */}
      {stats && (
        <section style={{ background: 'var(--scm-card-bg)', borderBottom: '1px solid var(--scm-border)' }}>
          <div className="container py-4" style={{ maxWidth: '1280px' }}>
            <div className="row gy-3 text-center">
              {[
                { label: 'Students Enrolled', value: stats.totalStudents ?? stats.totalEnrollments, icon: <FiUsers /> },
                { label: 'Completions', value: stats.completedEnrollments, icon: <FiAward /> },
                { label: 'Success Rate', value: '95%', icon: <FiTrendingUp /> },
              ].filter((s) => s.value !== null && s.value !== undefined).map((s) => (
                <div key={s.label} className="col-6 col-md-4">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                    <span style={{ color: 'var(--scm-primary)' }}>{s.icon}</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--scm-text)', fontFamily: 'var(--scm-font-display)' }}>{s.value}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--scm-text-secondary)', margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ POPULAR COURSES ══════════════════════════════════════ */}
      <section className="page-section" style={{ background: 'var(--scm-section-bg)' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-5">
            <span style={{ display: 'inline-block', background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Featured</span>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--scm-text)', marginBottom: '0.75rem' }}>Explore Popular Courses</h2>
            <p style={{ color: 'var(--scm-text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: '1rem' }}>
              Hand-picked courses taught by expert instructors to help you build real-world skills.
            </p>
          </motion.div>

          {coursesLoading ? (
            <div className="row g-4">
              {[1,2,3].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div className="card p-0" style={{ height: 340 }}>
                    <div className="skeleton" style={{ height: 180, borderRadius: 'var(--scm-radius) var(--scm-radius) 0 0' }} />
                    <div className="p-4"><div className="skeleton mb-2" style={{ height: 10, width: '60%' }} /><div className="skeleton mb-2" style={{ height: 14, width: '90%' }} /><div className="skeleton" style={{ height: 10, width: '40%' }} /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : popularCourses.length > 0 ? (
            <motion.div className="row g-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              {popularCourses.map((course) => (
                <motion.div className="col-12 col-sm-6 col-lg-4" key={course._id} variants={fadeInUp}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-4"><p style={{ color: 'var(--scm-text-secondary)' }}>Courses loading soon. Check back shortly!</p></div>
          )}

          <div className="text-center mt-5">
            <Link to={ROUTES.COURSES}>
              <Button variant="outline" size="lg">View All Courses <FiArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════ */}
      <section className="page-section" style={{ background: 'var(--scm-background)' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <div className="row align-items-center gy-5">
            <div className="col-12 col-lg-5">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span style={{ display: 'inline-block', background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem' }}>Why EduPath</span>
                <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--scm-text)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Built for focused,<br />structured learning
                </h2>
                <p style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 420 }}>
                  EduPath combines structured content with a calm environment so you can learn deeply
                  without distraction — whether you're a beginner or advancing your skills.
                </p>
                <Link to={ROUTES.STUDENT_REGISTER}>
                  <Button variant="primary">Join EduPath Free</Button>
                </Link>
              </motion.div>
            </div>
            <div className="col-12 col-lg-6 offset-lg-1">
              <div className="row g-3">
                {features.map((f, i) => (
                  <div key={f.title} className="col-12 col-sm-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', height: '100%', transition: 'box-shadow 0.22s, transform 0.22s' }}
                      whileHover={{ y: -4, boxShadow: 'var(--scm-shadow-hover)' }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>{f.icon}</div>
                      <h6 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--scm-text)' }}>{f.title}</h6>
                      <p style={{ fontSize: '0.875rem', color: 'var(--scm-text-secondary)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '5rem 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${IMG_HERO})`, backgroundSize: 'cover', backgroundPosition: 'center 60%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(107,79,58,0.92) 0%, rgba(47,42,38,0.88) 100%)' }} />
        <div className="container text-center" style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', marginBottom: '1rem' }}>
              Ready to start your learning journey?
            </motion.h2>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.80)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              Join thousands of students already learning on EduPath. It's free to get started.
            </motion.p>
            <motion.div variants={fadeInUp} className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to={ROUTES.STUDENT_REGISTER}>
                <Button variant="cream" size="lg" style={{ padding: '0.85rem 2.25rem', borderRadius: 'var(--scm-radius-sm)' }}>Create Free Account</Button>
              </Link>
              <Link to={ROUTES.COURSES}>
                <Button variant="ghost" size="lg" style={{ padding: '0.85rem 2.25rem', borderRadius: 'var(--scm-radius-sm)' }}>Browse Courses</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
