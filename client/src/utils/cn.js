/**
 * Joins conditional class names together, skipping falsy values.
 * Usage: cn('btn', isActive && 'btn-active', size === 'lg' && 'btn-lg')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
