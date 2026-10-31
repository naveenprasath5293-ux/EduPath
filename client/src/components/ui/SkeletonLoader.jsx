import { cn } from '../../utils/cn';

/**
 * Simple shimmering placeholder block. Compose multiple instances to
 * build skeleton layouts for cards, lists, tables, etc.
 * @param {string} width CSS width value
 * @param {string} height CSS height value
 */
export default function SkeletonLoader({ width = '100%', height = '1rem', rounded = true, className = '' }) {
  return (
    <span
      className={cn('d-block skeleton-shimmer', rounded && 'rounded-scm', className)}
      style={{
        width,
        height,
        backgroundColor: 'var(--scm-border)',
        backgroundImage:
          'linear-gradient(90deg, var(--scm-border) 25%, var(--scm-section-bg) 37%, var(--scm-border) 63%)',
        backgroundSize: '400% 100%',
        animation: 'scm-skeleton-shimmer 1.4s ease infinite',
      }}
    />
  );
}
