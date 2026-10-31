import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Presentational input designed to be spread with React Hook Form's
 * register(), e.g. <Input label="Email" {...register('email')} error={errors.email} />
 *
 * Wrapped in forwardRef so the ref that register() attaches (used by
 * RHF for focus management and native validation) reaches the actual
 * <input>/<textarea> DOM node instead of being silently dropped.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    type = 'text',
    as = 'input',
    error,
    className = '',
    containerClassName = '',
    rows = 4,
    ...rest
  },
  ref
) {
  const inputId = id || rest.name;
  const Tag = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={cn('mb-3', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label fw-medium">
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        id={inputId}
        type={Tag === 'input' ? type : undefined}
        rows={Tag === 'textarea' ? rows : undefined}
        className={cn('form-control', error && 'is-invalid', className)}
        {...rest}
      />
      {error && <div className="invalid-feedback d-block">{error.message || error}</div>}
    </div>
  );
});

export default Input;
