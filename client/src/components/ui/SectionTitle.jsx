import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';
import { cn } from '../../utils/cn';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  return (
    <motion.div
      className={cn('mb-5', align === 'center' ? 'text-center mx-auto' : '', className)}
      style={align === 'center' ? { maxWidth: '640px' } : undefined}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {eyebrow && (
        <span className="text-uppercase fw-semibold small" style={{ color: 'var(--scm-primary)', letterSpacing: '1px' }}>
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 mb-2">{title}</h2>
      {subtitle && <p className="text-secondary-custom mb-0">{subtitle}</p>}
    </motion.div>
  );
}
