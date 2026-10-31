/**
 * Smoothly scrolls the window to the top - used by the router's
 * ScrollToTop helper component on every navigation.
 */
export function scrollToTop(behavior = 'smooth') {
  window.scrollTo({ top: 0, left: 0, behavior });
}
