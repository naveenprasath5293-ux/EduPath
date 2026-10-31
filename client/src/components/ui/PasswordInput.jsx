import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Input from './Input';
import { cn } from '../../utils/cn';

/**
 * Wrapped in forwardRef, same reasoning as Input.jsx - register()'s
 * ref must reach the real <input> element underneath, so it's
 * forwarded straight through to the inner Input.
 */
const PasswordInput = forwardRef(function PasswordInput(
  { label, error, containerClassName = '', ...rest },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn('position-relative', containerClassName)}>
      <Input
        ref={ref}
        label={label}
        type={visible ? 'text' : 'password'}
        error={error}
        className="pe-5"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="btn btn-sm position-absolute border-0 bg-transparent"
        style={{ right: '4px', top: label ? '32px' : '4px', color: 'var(--scm-text-secondary)' }}
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
});

export default PasswordInput;
