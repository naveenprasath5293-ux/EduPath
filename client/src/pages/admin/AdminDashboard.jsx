import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiPlus, FiList, FiUsers, FiCheckCircle, FiEdit, FiTrendingUp, FiStar, FiAward } from 'react-icons/fi';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { formatPrice } from '../../constants/courseConstants';
import { ROUTES } from '../../constants/routePaths';

const FALLBACK_THUMB = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36" viewBox="0 0 56 36">
  <rect width="56" height="36" fill="#F3E8D7"/>
  <rect x="18" y="8" width="20" height="20" rx="4" fill="#C9823A" opacity="0.3"/>
</svg>`);

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courseStats, setCourseStats] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([courseService.getDashboardStats(), enrollmentService.getEnrollmentStats()])
      .then(([courseRes, enrollmentRes]) => {
        if (!cancelled) { setCourseStats(courseRes.data); setEnrollmentStats(enrollmentRes.data); }
      })
      .catch(() => {
        if (!cancelled) {
          setCourseStats({ total: 0, published: 0, draft: 0, deleted: 0, recentCourses: [] });
          setEnrollmentStats({ totalEnrollments: 0, activeEnrollments: 0, completedEnrollments: 0, totalStudents: 0, mostEnrolledCourse: null });
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'Admin';

  const statCards = [
    { label: 'Total Courses', value: courseStats?.total, icon: <FiBookOpen size={20} />, color: 'var(--scm-primary)', bg: 'var(--scm-primary-light)' },
    { label: 'Published', value: courseStats?.published, icon: <FiCheckCircle size={20} />, color: 'var(--scm-success)', bg: 'rgba(90,143,92,0.10)' },
    { label: 'Total Students', value: enrollmentStats?.totalStudents, icon: <FiUsers size={20} />, color: 'var(--scm-gold)', bg: 'rgba(217,164,65,0.12)' },
    { label: 'Enrollments', value: enrollmentStats?.totalEnrollments, icon: <FiTrendingUp size={20} />, color: 'var(--scm-warm-brown)', bg: 'rgba(107,79,58,0.10)' },
    { label: 'Active', value: enrollmentStats?.activeEnrollments, icon: <FiStar size={20} />, color: 'var(--scm-primary)', bg: 'var(--scm-primary-light)' },
    { label: 'Completed', value: enrollmentStats?.completedEnrollments, icon: <FiAward size={20} />, color: 'var(--scm-success)', bg: 'rgba(90,143,92,0.10)' },
    { label: 'Drafts', value: courseStats?.draft, icon: <FiEdit size={20} />, color: 'var(--scm-text-secondary)', bg: 'var(--scm-section-bg)' },
    { label: 'Most Enrolled', value: enrollmentStats?.mostEnrolledCourse?.enrollmentCount ?? 0, icon: <FiTrendingUp size={20} />, color: 'var(--scm-gold)', bg: 'rgba(217,164,65,0.12)' },
  ];

  return (
    <div style={{ background: 'var(--scm-section-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2F2A26 0%, #6B4F3A 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.55)', fontSize: '0.82rem', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Admin Portal
            </motion.p>
            <motion.h1 variants={fadeInUp} style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', margin: '0 0 0.35rem', fontFamily: 'var(--scm-font-display)' }}>
              Welcome, {firstName}
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.60)', fontSize: '0.9rem', margin: 0 }}>
              Here's everything happening on your platform.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1280px', marginTop: '-1.5rem', position: 'relative', zIndex: 10 }}>
        {/* Stat cards */}
        <div className="row g-3 mb-4">
          {statCards.map(({ label, value, icon, color, bg }) => (
            <div className="col-6 col-md-3" key={label}>
              <motion.div variants={fadeInUp} initial="hidden" animate="visible"
                style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.25rem 1.5rem', boxShadow: 'var(--scm-shadow-card)' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--scm-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ color, background: bg, padding: '0.3rem', borderRadius: 8, display: 'flex' }}>{icon}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--scm-text)', fontFamily: 'var(--scm-font-display)', lineHeight: 1 }}>
                  {isLoading ? <span style={{ fontSize: '1.2rem', color: 'var(--scm-text-muted)' }}>—</span> : (value ?? 0)}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row g-4 pb-5">
          {/* Recent Courses */}
          <div className="col-12 col-lg-8">
            <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', boxShadow: 'var(--scm-shadow-card)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--scm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h5 style={{ margin: 0, fontWeight: 700, color: 'var(--scm-text)' }}>Recent Courses</h5>
                <Link to={ROUTES.ADMIN_COURSE_LIST}>
                  <Button variant="outline" size="sm"><FiList size={13} /> View All</Button>
                </Link>
              </div>
              <div style={{ padding: '1rem 1.5rem' }}>
                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader fullScreen={false} /></div>
                ) : courseStats?.recentCourses?.length === 0 ? (
                  <EmptyState icon={<FiBookOpen />} title="No courses yet" description="Create your first course to see it here." actionLabel="Add Course" onAction={() => navigate(ROUTES.ADMIN_COURSE_ADD)} />
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {courseStats?.recentCourses?.map((course) => (
                      <div key={course._id} className="d-flex align-items-center gap-3 p-2" style={{ borderRadius: 'var(--scm-radius-sm)', border: '1px solid var(--scm-border-light)', background: 'var(--scm-section-bg)' }}>
                        <img
                          src={course.thumbnail || FALLBACK_THUMB}
                          alt={course.title}
                          style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                          onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link to={`/admin/courses/${course._id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--scm-text)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {course.title}
                          </Link>
                          <div style={{ fontSize: '0.78rem', color: 'var(--scm-text-secondary)' }}>{course.category} · {formatPrice(course.price)}</div>
                        </div>
                        <span style={{
                          padding: '0.2rem 0.65rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                          background: course.status === 'published' ? 'rgba(90,143,92,0.12)' : 'var(--scm-section-bg)',
                          color: course.status === 'published' ? 'var(--scm-success)' : 'var(--scm-text-muted)',
                          border: `1px solid ${course.status === 'published' ? 'rgba(90,143,92,0.25)' : 'var(--scm-border)'}`,
                          flexShrink: 0,
                        }}>
                          {course.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions + Most enrolled */}
          <div className="col-12 col-lg-4">
            <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', marginBottom: '1rem', boxShadow: 'var(--scm-shadow-card)' }}>
              <h6 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--scm-text)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h6>
              <div className="d-flex flex-column gap-2">
                <Link to={ROUTES.ADMIN_COURSE_ADD} className="w-100">
                  <Button variant="primary" className="w-100" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                    <FiPlus size={15} /> Add New Course
                  </Button>
                </Link>
                <Link to={ROUTES.ADMIN_COURSE_LIST} className="w-100">
                  <Button variant="outline" className="w-100" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                    <FiList size={15} /> Manage Courses
                  </Button>
                </Link>
              </div>
            </div>

            {enrollmentStats?.mostEnrolledCourse && (
              <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', boxShadow: 'var(--scm-shadow-card)' }}>
                <h6 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--scm-text)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Enrolled</h6>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <FiStar size={14} style={{ color: 'var(--scm-gold)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--scm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {enrollmentStats.mostEnrolledCourse.title}
                  </span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--scm-primary)', fontFamily: 'var(--scm-font-display)' }}>
                  {enrollmentStats.mostEnrolledCourse.enrollmentCount}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--scm-text-secondary)', marginLeft: 6 }}>students</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
