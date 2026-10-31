import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiClock, FiUser, FiTag, FiBarChart2, FiCheck, FiUsers,
  FiBookOpen, FiArrowRight, FiArrowLeft, FiAward
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { formatLevel, formatPrice } from '../../constants/courseConstants';
import { ROUTES, buildLearnPath } from '../../constants/routePaths';

const FALLBACK_IMG = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500">
  <rect width="1200" height="500" fill="#F3E8D7"/>
  <rect x="530" y="170" width="140" height="140" rx="28" fill="#C9823A" opacity="0.25"/>
  <text x="600" y="380" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#776F68">Course Image</text>
</svg>`);

export default function CourseView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    courseService.getPublicCourseBySlug(slug)
      .then((res) => {
        if (!cancelled) {
          setCourse(res.data.course);
          if (isAuthenticated) {
            enrollmentService.checkEnrollment(res.data.course._id)
              .then((r) => { if (!cancelled) setIsEnrolled(r.isEnrolled); })
              .catch(() => { if (!cancelled) setIsEnrolled(false); });
          }
        }
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [slug, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate(ROUTES.STUDENT_LOGIN); return; }
    setIsEnrolling(true);
    try {
      await enrollmentService.enroll(course._id);
      toast.success('Enrolled successfully! Start learning now.');
      setIsEnrolled(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader fullScreen={false} />
    </div>
  );

  if (notFound || !course) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <FiBookOpen size={48} style={{ color: 'var(--scm-border)' }} />
      <h3 style={{ color: 'var(--scm-text)' }}>Course not found</h3>
      <p style={{ color: 'var(--scm-text-secondary)' }}>This course may be unpublished or no longer available.</p>
      <Button variant="primary" onClick={() => navigate(ROUTES.COURSES)}>Back to Courses</Button>
    </div>
  );

  const thumbnail = course.thumbnail || FALLBACK_IMG;

  return (
    <div style={{ background: 'var(--scm-background)', minHeight: '100vh' }}>
      {/* ── HERO BANNER ──────────────────────────────────── */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #2F2A26 0%, #6B4F3A 60%, #C9823A 100%)', overflow: 'hidden', paddingTop: '3rem', paddingBottom: '3rem' }}>
        {/* subtle bg image overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.12, filter: 'blur(4px)',
        }} />

        <div className="container" style={{ maxWidth: '1280px', position: 'relative', zIndex: 1 }}>
          {/* Back link */}
          <Link
            to={ROUTES.COURSES}
            className="d-inline-flex align-items-center gap-2 mb-4"
            style={{ color: 'rgba(255,248,238,0.70)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
          >
            <FiArrowLeft size={15} /> All Courses
          </Link>

          <div className="row align-items-start gy-4">
            <div className="col-12 col-lg-7">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.span
                  variants={fadeInUp}
                  style={{
                    display: 'inline-block', background: 'rgba(255,248,238,0.15)',
                    color: '#FFF8EE', borderRadius: 99, padding: '0.3rem 1rem',
                    fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em',
                    textTransform: 'uppercase', border: '1px solid rgba(255,248,238,0.25)',
                    marginBottom: '1rem',
                  }}
                >
                  {course.category}
                </motion.span>

                <motion.h1
                  variants={fadeInUp}
                  style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', lineHeight: 1.2, marginBottom: '1rem', fontFamily: 'var(--scm-font-display)' }}
                >
                  {course.title}
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  style={{ color: 'rgba(255,248,238,0.80)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '1rem', maxWidth: 560 }}
                >
                  {course.shortDescription}
                </motion.p>

                <motion.div variants={fadeInUp} className="d-flex flex-wrap gap-4" style={{ fontSize: '0.85rem', color: 'rgba(255,248,238,0.75)' }}>
                  {course.instructor && (
                    <span className="d-flex align-items-center gap-2">
                      <FiUser size={14} style={{ color: 'var(--scm-gold)' }} /> {course.instructor}
                    </span>
                  )}
                  {course.level && (
                    <span className="d-flex align-items-center gap-2">
                      <FiBarChart2 size={14} style={{ color: 'var(--scm-gold)' }} /> {formatLevel(course.level)}
                    </span>
                  )}
                  {course.duration && (
                    <span className="d-flex align-items-center gap-2">
                      <FiClock size={14} style={{ color: 'var(--scm-gold)' }} /> {course.duration}
                    </span>
                  )}
                  {course.enrolledCount > 0 && (
                    <span className="d-flex align-items-center gap-2">
                      <FiUsers size={14} style={{ color: 'var(--scm-gold)' }} /> {course.enrolledCount.toLocaleString('en-IN')} enrolled
                    </span>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Hero image — desktop */}
            <div className="col-12 col-lg-4 offset-lg-1 d-none d-lg-block">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <img
                  src={thumbnail}
                  alt={course.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.30)' }}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="container py-5" style={{ maxWidth: '1280px' }}>
        <div className="row g-5">
          {/* Main column */}
          <div className="col-12 col-lg-7">
            {/* Mobile image */}
            <div className="d-lg-none mb-4">
              <img
                src={thumbnail}
                alt={course.title}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 16 }}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
              />
            </div>

            {/* About */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '2rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--scm-text)' }}>About This Course</h4>
                <p style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>{course.description}</p>
              </div>
            </motion.div>

            {/* What you'll gain */}
            {course.benefits?.length > 0 && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '2rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--scm-text)' }}>What You'll Gain</h4>
                  <div className="row g-3">
                    {course.benefits.map((b) => (
                      <div className="col-12 col-sm-6" key={b}>
                        <div className="d-flex align-items-start gap-3">
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(90,143,92,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <FiCheck size={13} style={{ color: 'var(--scm-success)' }} />
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--scm-text-secondary)', lineHeight: 1.5 }}>{b}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '2rem' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--scm-text)' }}>Requirements</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {course.requirements.map((req) => (
                      <li key={req} style={{ color: 'var(--scm-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{req}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar — sticky enrollment card */}
          <div className="col-12 col-lg-5">
            <div style={{ position: 'sticky', top: 90 }}>
              <motion.div
                variants={fadeInUp} initial="hidden" animate="visible"
                style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', boxShadow: 'var(--scm-shadow-hover)', overflow: 'hidden' }}
              >
                {/* Price header */}
                <div style={{ padding: '1.75rem 1.75rem 1.25rem', borderBottom: '1px solid var(--scm-border-light)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--scm-primary)', fontFamily: 'var(--scm-font-display)', lineHeight: 1, marginBottom: '0.4rem' }}>
                    {formatPrice(course.price)}
                  </div>
                  {course.price > 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--scm-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiAward size={12} /> Includes certificate on completion
                    </span>
                  )}
                </div>

                {/* CTA buttons */}
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--scm-border-light)' }}>
                  {isEnrolled ? (
                    <div className="d-flex flex-column gap-2">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.75rem', borderRadius: 'var(--scm-radius-sm)', background: 'rgba(90,143,92,0.10)', color: 'var(--scm-success)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        <FiCheck size={16} /> You're enrolled!
                      </div>
                      <Button variant="primary" className="w-100" onClick={() => navigate(enrollment?._id ? buildLearnPath(course._id) : ROUTES.STUDENT_DASHBOARD)} style={{ borderRadius: 'var(--scm-radius-sm)', fontWeight: 700 }}>
                        Continue Learning <FiArrowRight size={15} />
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={handleEnroll}
                        isLoading={isEnrolling}
                        style={{ borderRadius: 'var(--scm-radius-sm)', fontWeight: 700, padding: '0.875rem' }}
                      >
                        {!isEnrolling && 'Enroll Now'}
                      </Button>
                      {!isAuthenticated && (
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--scm-text-muted)', margin: '0.5rem 0 0' }}>
                          <Link to={ROUTES.STUDENT_LOGIN} style={{ color: 'var(--scm-primary)', fontWeight: 600 }}>Sign in</Link> to enroll
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Course details */}
                <div style={{ padding: '1.25rem 1.75rem' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--scm-text-muted)', marginBottom: '1rem' }}>
                    Course includes
                  </p>
                  <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                    {[
                      { icon: <FiUser size={15} />, label: 'Instructor', value: course.instructor },
                      { icon: <FiTag size={15} />, label: 'Category', value: course.category },
                      { icon: <FiBarChart2 size={15} />, label: 'Level', value: formatLevel(course.level) },
                      { icon: <FiClock size={15} />, label: 'Duration', value: course.duration },
                      { icon: <FiUsers size={15} />, label: 'Enrolled', value: course.enrolledCount > 0 ? `${course.enrolledCount.toLocaleString('en-IN')} students` : null },
                    ].filter((i) => i.value).map((item) => (
                      <li key={item.label} className="d-flex align-items-center gap-3">
                        <span style={{ color: 'var(--scm-primary)', flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--scm-text-secondary)', flex: 1 }}>
                          <strong style={{ color: 'var(--scm-text)', fontWeight: 600 }}>{item.label}:</strong> {item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
