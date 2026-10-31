import { motion } from 'framer-motion';
import { fadeIn } from '../../animations/variants';
import Button from './Button';

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      className="text-center py-5"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {icon && (
        <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--scm-accent)' }}>
          {icon}
        </div>
      )}
      <h5 className="mb-2">{title}</h5>
      {description && <p className="text-secondary-custom mb-3">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
