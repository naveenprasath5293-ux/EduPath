/**
 * Shared Framer Motion variants. Import into any component instead of
 * redefining transition objects inline, so animation timing/easing
 * stays consistent app-wide.
 */

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** Whole-page transition wrapper, used by PageContainer. */
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: 'easeInOut' },
};

/** Hover/tap micro-interaction for cards. */
export const cardHover = {
  rest: { scale: 1, boxShadow: '0 4px 20px rgba(217, 119, 6, 0.08)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 28px rgba(217, 119, 6, 0.14)',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

/** Hover/tap micro-interaction for buttons. */
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};
