export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const COURSE_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

export const ADMIN_STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'deleted', label: 'Deleted' },
];

export function formatLevel(level) {
  const found = COURSE_LEVELS.find((l) => l.value === level);
  return found ? found.label : level;
}

/**
 * Format price as Indian Rupees using Indian number system.
 * e.g. 1499 → ₹1,499   |   100000 → ₹1,00,000   |   0 → Free
 */
export function formatPrice(price) {
  if (price === 0 || price === '0') return 'Free';
  const num = Number(price);
  if (isNaN(num)) return 'Free';
  return '₹' + num.toLocaleString('en-IN');
}
