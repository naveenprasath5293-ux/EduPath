import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Debounces input so onSearch isn't fired on every keystroke.
 */
export default function SearchBar({ placeholder = 'Search...', onSearch, delay = 400, className = '' }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`position-relative ${className}`}>
      <FiSearch
        className="position-absolute"
        style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--scm-text-secondary)' }}
      />
      <input
        type="search"
        className="form-control ps-5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
