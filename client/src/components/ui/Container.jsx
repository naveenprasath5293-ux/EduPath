import { cn } from '../../utils/cn';

/**
 * Thin wrapper around Bootstrap's .container to keep consistent
 * max-width/padding conventions in one place.
 * @param {'sm'|'md'|'lg'|'fluid'} size
 */
export default function Container({ children, size = 'lg', className = '' }) {
  const sizeClass = size === 'fluid' ? 'container-fluid' : 'container';

  return <div className={cn(sizeClass, className)}>{children}</div>;
}
