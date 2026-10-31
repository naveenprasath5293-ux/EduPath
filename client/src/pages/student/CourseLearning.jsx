import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiCheckCircle, FiCircle, FiChevronLeft, FiChevronRight,
  FiMenu, FiX, FiExternalLink, FiArrowLeft, FiBookOpen,
} from 'react-icons/fi';
import lessonService from '../../services/lessonService';
import Loader from '../../components/ui/Loader';
import { fadeInUp } from '../../animations/variants';
import { ROUTES } from '../../constants/routePaths';

/* ── helpers ─────────────────────────────────────────────────── */
function toEmbedUrl(url) {
  if (!url) return '';
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
}

/* ── component ───────────────────────────────────────────────── */
export default function CourseLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  /* fetch course + lessons */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const lessonRes = await lessonService.getLessons(courseId);
      setCourse(lessonRes.data.course || null);
      setLessons(lessonRes.data.lessons || []);
      setEnrollment(lessonRes.data.enrollment);

      // Resume from last incomplete lesson instead of always Lesson 1
      const completedIds = new Set(
        (lessonRes.data.enrollment?.completedLessons || []).map(String)
      );
      const firstIncomplete = (lessonRes.data.lessons || []).findIndex(
        (l) => !completedIds.has(String(l._id))
      );
      setCurrentIdx(firstIncomplete >= 0 ? firstIncomplete : 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load course content.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentLesson = lessons[currentIdx];
  const completedSet = new Set((enrollment?.completedLessons || []).map(String));
  const isCurrentComplete = currentLesson ? completedSet.has(String(currentLesson._id)) : false;

  /* mark lesson complete */
  const handleComplete = async () => {
    if (!currentLesson || isCurrentComplete || completing) return;
    setCompleting(true);
    try {
      const res = await lessonService.completeLesson(courseId, currentLesson._id);
      const updated = res.data;
      setEnrollment((prev) => ({
        ...prev,
        progress: updated.progress,
        status: updated.status,
        completedLessons: updated.completedLessons,
      }));
      if (updated.courseCompleted) {
        toast.success('🎉 Course completed! Congratulations!', { duration: 5000 });
      } else {
        toast.success('Lesson marked complete!');
        // Auto-advance to next lesson
        if (currentIdx < lessons.length - 1) {
          setTimeout(() => setCurrentIdx((i) => i + 1), 600);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark lesson complete.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--scm-background)' }}>
        <div className="text-center p-5">
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>🔒</div>
          <h3 style={{ color: 'var(--scm-text)', marginBottom: '0.75rem' }}>Access Denied</h3>
          <p style={{ color: 'var(--scm-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to={ROUTES.COURSES} className="btn btn-outline-primary">Browse Courses</Link>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--scm-background)' }}>
        <div className="text-center p-5">
          <FiBookOpen size={48} style={{ color: 'var(--scm-primary)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--scm-text)', marginBottom: '0.75rem' }}>No Lessons Yet</h3>
          <p style={{ color: 'var(--scm-text-secondary)' }}>This course has no published lessons yet. Check back soon!</p>
          <Link to={ROUTES.STUDENT_DASHBOARD} className="btn btn-primary mt-3">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const progress = enrollment?.progress ?? 0;
  const isCourseComplete = enrollment?.status === 'completed';
  const embedUrl = currentLesson ? toEmbedUrl(currentLesson.videoUrl || currentLesson.embedUrl) : '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--scm-background)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top bar ── */}
      <div style={{
        background: 'var(--scm-card-bg)',
        borderBottom: '1px solid var(--scm-border)',
        padding: '0.875rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', position: 'sticky', top: 0, zIndex: 200,
        boxShadow: 'var(--scm-shadow-card)',
      }}>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm d-flex align-items-center gap-1"
            style={{ color: 'var(--scm-text-secondary)', background: 'none', border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-xs)', padding: '0.3rem 0.7rem' }}
            onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
          >
            <FiArrowLeft size={14} /> Back
          </button>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--scm-text)', lineHeight: 1.2 }}>
              {course?.title || 'Course Learning'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--scm-text-secondary)' }}>
              Lesson {(currentIdx + 1)} of {lessons.length}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="d-none d-md-flex align-items-center gap-3" style={{ flex: '0 0 220px' }}>
          <div style={{ flex: 1, background: 'var(--scm-border)', borderRadius: 99, height: 6 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--scm-primary)', borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--scm-primary)', whiteSpace: 'nowrap' }}>{progress}%</span>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          className="btn btn-sm d-md-none"
          style={{ color: 'var(--scm-text)', background: 'var(--scm-section-bg)', border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-xs)' }}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle lessons sidebar"
        >
          {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Sidebar — desktop always visible, mobile collapsible */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              key="sidebar"
              className={sidebarOpen ? 'd-flex' : 'd-none d-md-flex'}
              style={{
                position: sidebarOpen ? 'fixed' : 'sticky',
                top: sidebarOpen ? 0 : 'auto',
                left: 0,
                zIndex: sidebarOpen ? 300 : 'auto',
                width: sidebarOpen ? '100vw' : 280,
                minWidth: sidebarOpen ? '100vw' : 280,
                maxWidth: sidebarOpen ? '100vw' : 280,
                height: sidebarOpen ? '100vh' : 'calc(100vh - 60px)',
                flexDirection: 'column',
                background: 'var(--scm-card-bg)',
                borderRight: '1px solid var(--scm-border)',
                overflowY: 'auto',
              }}
              initial={sidebarOpen ? { x: -320 } : false}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {sidebarOpen && (
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--scm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--scm-text)' }}>Course Lessons</span>
                  <button className="btn btn-sm" style={{ background: 'none', border: 'none', color: 'var(--scm-text-muted)' }} onClick={() => setSidebarOpen(false)}>
                    <FiX size={18} />
                  </button>
                </div>
              )}

              <div style={{ padding: '1rem 0' }}>
                <div style={{ padding: '0 1.25rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--scm-text-muted)' }}>
                    {lessons.length} Lessons
                  </div>
                  <div style={{ marginTop: '0.5rem', background: 'var(--scm-border)', borderRadius: 99, height: 4 }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--scm-primary)', borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--scm-text-secondary)', marginTop: 4 }}>
                    {(enrollment?.completedLessons?.length ?? 0)} of {lessons.length} complete
                  </div>
                </div>

                {lessons.map((lesson, idx) => {
                  const done = completedSet.has(String(lesson._id));
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={lesson._id}
                      onClick={() => { setCurrentIdx(idx); setSidebarOpen(false); }}
                      style={{
                        width: '100%', textAlign: 'left', border: 'none',
                        padding: '0.75rem 1.25rem',
                        background: isCurrent ? 'var(--scm-primary-light)' : 'transparent',
                        borderLeft: isCurrent ? `3px solid var(--scm-primary)` : '3px solid transparent',
                        cursor: 'pointer', transition: 'background 0.15s',
                        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                      }}
                    >
                      <span style={{ color: done ? 'var(--scm-success)' : (isCurrent ? 'var(--scm-primary)' : 'var(--scm-border)'), marginTop: 2, flexShrink: 0 }}>
                        {done ? <FiCheckCircle size={16} /> : <FiCircle size={16} />}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--scm-text-muted)', marginBottom: 2 }}>
                          Lesson {lesson.lessonNumber}
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--scm-primary)' : 'var(--scm-text)', lineHeight: 1.35 }}>
                          {lesson.title}
                        </div>
                        {lesson.duration && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--scm-text-muted)', marginTop: 2 }}>
                            {lesson.duration}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {currentLesson && (
              <motion.div key={currentLesson._id} variants={fadeInUp} initial="hidden" animate="visible">
                {/* Lesson header */}
                <div className="mb-4">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--scm-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Lesson {currentLesson.lessonNumber}
                  </span>
                  <h2 style={{ fontWeight: 800, color: 'var(--scm-text)', marginBottom: '0.5rem', fontFamily: 'var(--scm-font-display)' }}>
                    {currentLesson.title}
                  </h2>
                  {currentLesson.duration && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--scm-text-secondary)' }}>
                      ⏱ {currentLesson.duration}
                    </span>
                  )}
                </div>

                {/* Video */}
                {embedUrl ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--scm-radius)', overflow: 'hidden', marginBottom: '2rem', background: '#000', boxShadow: 'var(--scm-shadow-soft)' }}>
                    <iframe
                      src={embedUrl}
                      title={currentLesson.title}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                ) : (
                  <div style={{ background: 'var(--scm-section-bg)', borderRadius: 'var(--scm-radius)', border: '1px dashed var(--scm-border)', padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
                    <FiExternalLink size={28} style={{ color: 'var(--scm-text-muted)', marginBottom: '0.75rem' }} />
                    <p style={{ color: 'var(--scm-text-secondary)', margin: 0 }}>No video available for this lesson.</p>
                  </div>
                )}

                {/* Description */}
                {currentLesson.description && (
                  <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h6 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--scm-text)' }}>About this Lesson</h6>
                    <p style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.75, margin: 0 }}>{currentLesson.description}</p>
                  </div>
                )}

                {/* Content / notes */}
                {currentLesson.content && (
                  <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h6 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--scm-text)' }}>Lesson Notes</h6>
                    <div style={{ color: 'var(--scm-text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{currentLesson.content}</div>
                  </div>
                )}

                {/* Completion status */}
                {isCourseComplete && (
                  <div style={{ background: 'rgba(90,143,92,0.10)', border: '1px solid rgba(90,143,92,0.30)', borderRadius: 'var(--scm-radius)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎉</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#3d7a3f' }}>Course Completed!</div>
                      <div style={{ fontSize: '0.85rem', color: '#5a8f5c' }}>You've completed all lessons in this course.</div>
                    </div>
                  </div>
                )}

                {/* Nav + Mark Complete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid var(--scm-border)' }}>
                  <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    style={{ borderRadius: 'var(--scm-radius-sm)' }}
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((i) => i - 1)}
                  >
                    <FiChevronLeft size={16} /> Previous
                  </button>

                  {!isCurrentComplete && !isCourseComplete && (
                    <button
                      className="btn btn-primary d-flex align-items-center gap-2"
                      style={{ borderRadius: 'var(--scm-radius-sm)', fontWeight: 700, padding: '0.6rem 1.5rem' }}
                      onClick={handleComplete}
                      disabled={completing}
                    >
                      {completing ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <FiCheckCircle size={16} />
                      )}
                      Mark as Complete
                    </button>
                  )}

                  {isCurrentComplete && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--scm-success)', fontWeight: 700, fontSize: '0.9rem' }}>
                      <FiCheckCircle size={16} /> Completed
                    </span>
                  )}

                  <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    style={{ borderRadius: 'var(--scm-radius-sm)' }}
                    disabled={currentIdx === lessons.length - 1}
                    onClick={() => setCurrentIdx((i) => i + 1)}
                  >
                    Next <FiChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
