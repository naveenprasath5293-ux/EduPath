import { motion } from 'framer-motion';
import { pageTransition } from '../../animations/variants';
import { cn } from '../../utils/cn';

/**
 * Wraps dashboard/admin content pages: applies shared page-transition
 * animation and consistent vertical rhythm. Uses maxWidth 1280px to
 * align with the new layout system.
 */
export default function PageContainer({ children, className = '', noPad = false }) {
  return (
    <motion.div
      className={cn(!noPad && 'page-section', className)}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      <div className="container" style={{ maxWidth: '1280px' }}>
        {children}
      </div>
    </motion.div>
  );
}
