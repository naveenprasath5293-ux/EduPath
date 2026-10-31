import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { fadeInUp } from '../../animations/variants';
import { formatLevel, formatPrice } from '../../constants/courseConstants';

const FALLBACK_IMG = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#F3E8D7"/>
  <rect x="270" y="130" width="100" height="100" rx="20" fill="#C9823A" opacity="0.3"/>
  <text x="320" y="285" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#776F68">Course Image</text>
</svg>`);

export default function CourseCard({ course }) {
  const imgSrc = course.thumbnail || FALLBACK_IMG;

  return (
    <motion.div
      className="card h-100 overflow-hidden"
      style={{
        border: '1px solid var(--scm-border)',
        borderRadius: 'var(--scm-radius)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        cursor: 'pointer',
      }}
      whileHover={{ y: -5, boxShadow: 'var(--scm-shadow-hover)' }}
      variants={fadeInUp}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--scm-sidebar-bg)', position: 'relative' }}>
        <img
          src={imgSrc}
          alt={course.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' }}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        {/* Level badge */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,248,238,0.92)', color: 'var(--scm-warm-brown)',
          borderRadius: 99, padding: '0.22rem 0.65rem',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
          border: '1px solid rgba(107,79,58,0.15)',
        }}>
          {formatLevel(course.level)}
        </span>
      </div>

      <div className="card-body d-flex flex-column p-3">
        {/* Category */}
        <span className="badge-category mb-2" style={{ alignSelf: 'flex-start' }}>
          {course.category}
        </span>

        {/* Title */}
        <h6 style={{
          fontWeight: 700, fontSize: '0.95rem',
          color: 'var(--scm-text)', marginBottom: '0.4rem',
          lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.title}
        </h6>

        {/* Short description */}
        <p style={{
          fontSize: '0.82rem', color: 'var(--scm-text-secondary)',
          marginBottom: '0.875rem', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '2.55em',
        }}>
          {course.shortDescription || 'Practical, structured course designed for real-world skills.'}
        </p>

        {/* Meta row */}
        <div className="d-flex align-items-center flex-wrap gap-3 mb-3" style={{ fontSize: '0.78rem', color: 'var(--scm-text-secondary)' }}>
          {course.instructor && (
            <span className="d-flex align-items-center gap-1">
              <FiUser size={12} style={{ color: 'var(--scm-primary)', flexShrink: 0 }} />
              {course.instructor}
            </span>
          )}
          {course.duration && (
            <span className="d-flex align-items-center gap-1">
              <FiClock size={12} style={{ flexShrink: 0 }} />
              {course.duration}
            </span>
          )}
        </div>

        {/* Enrolled count */}
        {course.enrolledCount > 0 && (
          <div className="d-flex align-items-center gap-1 mb-3" style={{ fontSize: '0.78rem', color: 'var(--scm-text-secondary)' }}>
            <FiUsers size={12} style={{ color: 'var(--scm-primary)' }} />
            <span>{course.enrolledCount.toLocaleString('en-IN')} enrolled</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="d-flex align-items-center justify-content-between mt-auto pt-2" style={{ borderTop: '1px solid var(--scm-border-light)' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--scm-primary)', fontFamily: 'var(--scm-font-display)' }}>
            {formatPrice(course.price)}
          </span>
          <Link
            to={`/courses/${course.slug}`}
            className="btn btn-outline-primary btn-sm"
            style={{ borderRadius: 'var(--scm-radius-xs)', fontSize: '0.8rem', fontWeight: 600, padding: '0.35rem 0.85rem' }}
          >
            View Course
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
