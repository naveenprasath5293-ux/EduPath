import { motion } from 'framer-motion';
import { cardHover } from '../../animations/variants';
import { cn } from '../../utils/cn';

export default function Card({ children, className = '', hoverable = true, ...rest }) {
  return (
    <motion.div
      className={cn('card border-0 p-4', className)}
      variants={hoverable ? cardHover : undefined}
      initial="rest"
      whileHover={hoverable ? 'hover' : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
