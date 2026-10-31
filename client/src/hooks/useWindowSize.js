import { useEffect, useState } from 'react';

/**
 * Tracks current viewport width/height. Used by layout components to
 * make small responsive decisions in JS (e.g. closing a mobile menu on
 * resize) that CSS media queries alone can't express.
 */
export default function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
