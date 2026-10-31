import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiBookOpen, FiArrowRight, FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import ProfileCard from '../../components/dashboard/ProfileCard';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import { useAuth } from '../../context/AuthContext';
import enrollmentService from '../../services/enrollmentService';
import { ROUTES, buildLearnPath } from '../../constants/routePaths';

const FALLBACK_THUMB = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="56" viewBox="0 0 80 56">
  <rect width="80" height="56" fill="#F3E8D7"/>
  <rect x="30" y="16" width="20" height="24" rx="4" fill="#C9823A" opacity="0.3"/>
</svg>`);

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    enrollmentService.getMyCourses()
      .then((res) => { if (!cancelled) setEnrollments(res.data); })
      .catch(() => { if (!cancelled) setEnrollments([]); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
  const inProgress = enrollments.filter((e) => e.status !== 'completed').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const filteredEnrollments = activeTab === 'all'
    ? enrollments
    : enrollments.filter((e) => (activeTab === 'completed' ? e.status === 'completed' : e.status !== 'completed'));

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div style={{ background: 'var(--scm-section-bg)', minHeight: '100vh' }}>
      {/* ── Welcome header ── */}
      <div style={{ background: 'linear-gradient(135deg, #6B4F3A 0%, #C9823A 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.70)', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Student Dashboard
            </motion.p>
            <motion.h1 variants={fadeInUp} style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--scm-font-display)', marginBottom: '0.4rem' }}>
              Welcome back, {firstName}! 👋
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.70)', fontSize: '0.95rem', margin: 0 }}>
              {enrollments.length > 0
                ? `You have ${inProgress} course${inProgress !== 1 ? 's' : ''} in progress. Keep going!`
                : 'Explore courses and start your learning journey today.'}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Stat cards — overlap header ── */}
      <div className="container" style={{ maxWidth: '1280px', marginTop: '-1.5rem', position: 'relative', zIndex: 10 }}>
        <div className="row g-3 mb-4">
          {[
            { label: 'Enrolled', value: isLoading ? '—' : enrollments.length, icon: <FiBookOpen size={20} />, color: 'var(--scm-primary)' },
            { label: 'Completed', value: isLoading ? '—' : completedCourses, icon: <FiAward size={20} />, color: 'var(--scm-success)' },
            { label: 'In Progress', value: isLoading ? '—' : inProgress, icon: <FiTrendingUp size={20} />, color: 'var(--scm-gold)' },
            { label: 'Avg. Progress', value: isLoading ? '—' : `${avgProgress}%`, icon: <FiUser size={20} />, color: 'var(--scm-warm-brown)' },
          ].map(({ label, value, icon, color }) => (
            <div className="col-6 col-lg-3" key={label}>
              <motion.div variants={fadeInUp} initial="hidden" animate="visible"
                style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.25rem 1.5rem', boxShadow: 'var(--scm-shadow-card)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--scm-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ color, background: `${color}18`, padding: '0.3rem', borderRadius: 8, display: 'flex', alignItems: 'center' }}>{icon}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--scm-text)', fontFamily: 'var(--scm-font-display)', lineHeight: 1 }}>{value}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container pb-5" style={{ maxWidth: '1280px' }}>
        <div className="row g-4">
          {/* My Courses */}
          <div className="col-12 col-lg-8">
            <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', overflow: 'hidden', boxShadow: 'var(--scm-shadow-card)' }}>
              {/* Tab header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--scm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h5 style={{ margin: 0, fontWeight: 700, color: 'var(--scm-text)' }}>My Courses</h5>
                <div className="d-flex gap-1">
                  {['all', 'in-progress', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '0.3rem 0.75rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.18s',
                        background: activeTab === tab ? 'var(--scm-primary)' : 'transparent',
                        color: activeTab === tab ? '#fff' : 'var(--scm-text-secondary)',
                      }}
                    >
                      {tab === 'all' ? 'All' : tab === 'in-progress' ? 'In Progress' : 'Completed'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.25rem 1.5rem' }}>
                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}><Loader fullScreen={false} /></div>
                ) : filteredEnrollments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--scm-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <FiBookOpen size={28} style={{ color: 'var(--scm-primary)' }} />
                    </div>
                    <h6 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                      {activeTab === 'all' ? "You haven't enrolled in any courses yet" : `No ${activeTab} courses`}
                    </h6>
                    <p style={{ color: 'var(--scm-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                      Explore our course catalog and start your learning journey.
                    </p>
                    <Link to={ROUTES.COURSES}>
                      <Button variant="primary">Browse Courses <FiArrowRight size={14} /></Button>
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {filteredEnrollments.map((enrollment) => {
                      const thumb = enrollment.course?.thumbnail || FALLBACK_THUMB;
                      return (
                        <motion.div
                          key={enrollment._id}
                          variants={fadeInUp}
                          style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', borderRadius: 'var(--scm-radius-sm)', border: '1px solid var(--scm-border-light)', background: 'var(--scm-section-bg)', transition: 'box-shadow 0.2s' }}
                          whileHover={{ boxShadow: 'var(--scm-shadow-soft)' }}
                        >
                          <img
                            src={thumb}
                            alt={enrollment.course?.title}
                            style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h6 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9rem', color: 'var(--scm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {enrollment.course?.title}
                            </h6>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                              <div style={{ flex: 1, background: 'var(--scm-border)', borderRadius: 99, height: 5 }}>
                                <div style={{ width: `${enrollment.progress || 0}%`, height: '100%', background: 'var(--scm-primary)', borderRadius: 99, transition: 'width 0.4s' }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--scm-primary)', flexShrink: 0 }}>{enrollment.progress || 0}%</span>
                            </div>
                            <span style={{
                              display: 'inline-block', padding: '0.15rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                              background: enrollment.status === 'completed' ? 'rgba(90,143,92,0.12)' : 'var(--scm-primary-light)',
                              color: enrollment.status === 'completed' ? 'var(--scm-success)' : 'var(--scm-primary)',
                            }}>
                              {enrollment.status === 'completed' ? '✓ Completed' : 'In Progress'}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(buildLearnPath(enrollment.course?._id))}
                            style={{ flexShrink: 0, borderRadius: 8 }}
                          >
                            <FiArrowRight size={14} />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile sidebar */}
          <div className="col-12 col-lg-4">
            <div style={{ position: 'sticky', top: 90 }}>
              <ProfileCard />
              <div style={{ marginTop: '1rem' }}>
                <Link to={ROUTES.COURSES}>
                  <Button variant="outline" className="w-100">
                    <FiBookOpen size={15} /> Browse More Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
