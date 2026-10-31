import { motion } from 'framer-motion';
import { buttonHover } from '../../animations/variants';
import { cn } from '../../utils/cn';

/**
 * @param {'primary'|'secondary'|'outline'|'cream'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 *
 * 'cream'  — warm cream background (#FFF8EE), dark warm-brown text.
 *            Used on dark/gradient hero backgrounds so text stays readable.
 * 'ghost'  — transparent background, white text + border.
 *            Used on dark backgrounds for secondary CTAs.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const variantStyles = {
    primary: {
      className: 'btn-primary',
      style: {},
    },
    secondary: {
      className: 'btn-secondary',
      style: {},
    },
    outline: {
      className: 'btn-outline-primary',
      style: {},
    },
    cream: {
      className: '',
      style: {
        background: '#FFF8EE',
        color: '#6B4F3A',
        border: 'none',
        fontWeight: 700,
      },
    },
    ghost: {
      className: '',
      style: {
        background: 'transparent',
        color: '#FFF8EE',
        border: '2px solid rgba(255,248,238,0.50)',
        fontWeight: 600,
      },
    },
  };

  const sizeClass = { sm: 'btn-sm', md: '', lg: 'btn-lg' }[size];
  const { className: variantClass, style: variantStyle } = variantStyles[variant] || variantStyles.primary;

  return (
    <motion.button
      type={type}
      className={cn(
        'btn',
        variantClass,
        sizeClass,
        'd-inline-flex align-items-center justify-content-center gap-2',
        className
      )}
      style={variantStyle}
      onClick={onClick}
      disabled={disabled || isLoading}
      variants={buttonHover}
      initial="rest"
      whileHover={disabled || isLoading ? 'rest' : 'hover'}
      whileTap={disabled || isLoading ? 'rest' : 'tap'}
      onMouseEnter={(e) => {
        if (variant === 'cream') {
          e.currentTarget.style.background = '#F3E8D7';
          e.currentTarget.style.color = '#4A3728';
        }
        if (variant === 'ghost') {
          e.currentTarget.style.background = 'rgba(255,248,238,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'cream') {
          e.currentTarget.style.background = '#FFF8EE';
          e.currentTarget.style.color = '#6B4F3A';
        }
        if (variant === 'ghost') {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      {...rest}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      )}
      {children}
    </motion.button>
  );
}
