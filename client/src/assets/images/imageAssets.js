/**
 * Centralized image asset constants for EduPath.
 * All images sourced from Unsplash (free to use).
 * Using stable, direct image URLs with specific IDs so they never change.
 * Overlays handle readability — never rely on image text.
 */

// Hero — warm library / study environment
export const IMG_HERO = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80&auto=format&fit=crop';

// Student Login/Register — peaceful study desk
export const IMG_AUTH_STUDENT = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80&auto=format&fit=crop';

// Admin Login — professional education / administration
export const IMG_AUTH_ADMIN = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop';

// Course hero fallback — books / learning
export const IMG_COURSE_FALLBACK = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80&auto=format&fit=crop';

/**
 * SVG fallback for when images fail to load.
 * Used as <img> onError replacement — never shows broken icon.
 */
export const SVG_COURSE_CARD = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#F3E8D7"/>
  <rect x="270" y="130" width="100" height="100" rx="20" fill="#C9823A" opacity="0.25"/>
  <text x="320" y="285" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#776F68">Course Image</text>
</svg>`);

export const SVG_THUMB_SMALL = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="56" viewBox="0 0 80 56">
  <rect width="80" height="56" fill="#F3E8D7"/>
  <rect x="30" y="16" width="20" height="24" rx="4" fill="#C9823A" opacity="0.3"/>
</svg>`);
