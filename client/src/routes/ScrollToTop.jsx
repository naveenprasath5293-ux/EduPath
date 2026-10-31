import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

/**
 * Mounted once near the root of the router. Has no visual output -
 * just resets scroll position whenever the pathname changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop('auto');
  }, [pathname]);

  return null;
}
