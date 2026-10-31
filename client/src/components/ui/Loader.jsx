import { cn } from '../../utils/cn';

/**
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullScreen centers the loader in a full-viewport wrapper
 */
export default function Loader({ size = 'md', fullScreen = false, label = 'Loading...' }) {
  const dimension = { sm: '1.25rem', md: '2rem', lg: '3rem' }[size];

  const spinner = (
    <div
      className="spinner-border"
      style={{ width: dimension, height: dimension, color: 'var(--scm-primary)' }}
      role="status"
    >
      <span className="visually-hidden">{label}</span>
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div
      className={cn('d-flex align-items-center justify-content-center')}
      style={{ minHeight: '60vh' }}
    >
      {spinner}
    </div>
  );
}
